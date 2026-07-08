import { z } from "zod"

const chatRoleSchema = z.enum(['developer', 'system', 'user', 'assistant'])
export type ChatRole = z.infer<typeof chatRoleSchema>

const chatMessageSchema = z.object({
    role: chatRoleSchema,
    content: z.string(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>


const openAiCompatibleConfigSchema = z.object({
    providerType: z.literal('openai-compatible'),
    baseUrl: z.string(),
    apiKey: z.string(),
    model: z.string(),
    temperature: z.number(),
    maxTokens: z.number(),
})

export type OpenAiCompatibleConfig = z.infer<typeof openAiCompatibleConfigSchema>

export const chatCompletionRequestSchema = z.object({
    model: z.string(),
    messages: z.array(chatMessageSchema),
    temperature: z.number().optional(),
    max_tokens: z.number().optional(),
})
export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>

export const chatCompletionResponseSchema = z.object({
    id: z.string(),
    model: z.string(),
    choices: z.array(z.object({
        index: z.number(),
        finish_reason: z.string().nullable(),
        message: z.object({
            role: z.literal('assistant'),
            content: z.string().nullable(),
        }),
    })),
    usage: z.object({
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),
    }).optional(),
}).optional()
export type ChatCompletionResponse = z.infer<typeof chatCompletionResponseSchema>

export const llmConfigSchema = z.object({
    providerType: z.enum(['openai-compatible']),
    config: openAiCompatibleConfigSchema,
})
export type LlmConfig = z.infer<typeof llmConfigSchema>