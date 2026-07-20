import { z } from 'zod'

const chatRoleSchema = z.enum(['developer', 'system', 'user', 'assistant'])
export type ChatRole = z.infer<typeof chatRoleSchema>

const chatMessageSchema = z.object({
    role: chatRoleSchema,
    content: z.string(),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>

export const llmProviderTypeSchema = z.enum(['openai-compatible', 'anthropic'])
export type LlmProviderType = z.infer<typeof llmProviderTypeSchema>

export const llmConfigSchema = z.object({
    providerType: llmProviderTypeSchema,
    baseUrl: z.string(),
    apiKey: z.string(),
    model: z.string(),
    temperature: z.number(),
    maxTokens: z.number(),
})
export type LlmConfig = z.infer<typeof llmConfigSchema>

export type NormalizedLlmResponse = {
    text: string
    finishReason: string | null
}

export type GenerateChatCompletionOptions = {
    maxTokens?: number
    temperature?: number
}

export const chatCompletionRequestSchema = z.object({
    model: z.string(),
    messages: z.array(chatMessageSchema),
    temperature: z.number().optional(),
    max_tokens: z.number().optional(),
    reasoning_effort: z.enum(['none', 'low', 'medium', 'high']).optional(),
})
export type ChatCompletionRequest = z.infer<typeof chatCompletionRequestSchema>

export const chatCompletionResponseSchema = z.object({
    id: z.string(),
    model: z.string(),
    choices: z.array(
        z.object({
            index: z.number(),
            finish_reason: z.string().nullable(),
            message: z.object({
                role: z.literal('assistant'),
                content: z.string().nullable(),
                reasoning_content: z.string().nullable().optional(),
            }),
        }),
    ),
    usage: z
        .object({
            prompt_tokens: z.number(),
            completion_tokens: z.number(),
            total_tokens: z.number(),
        })
        .optional(),
})
export type ChatCompletionResponse = z.infer<typeof chatCompletionResponseSchema>
