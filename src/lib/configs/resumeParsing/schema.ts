export const RESUME_JSON_SCHEMA = `{
  "id": "string",
  "title": "string",
  "source": "string",
  "language": "string",
  "selfAbout": "string (optional)",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "description": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "education": [
    {
      "organization": "string",
      "degree": "string",
      "speciality": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "link": "string (optional)"
    }
  ] (optional, default []),
  "certifications": [
    {
      "name": "string",
      "description": "string"
    }
  ] (optional, default [])
}`

export const RESUME_PARSING_OUTPUT_FORMAT_RULES = `Формат ответа:
- Верни только валидный JSON без markdown-блоков, комментариев и пояснений.
- Не оборачивай ответ в markdown code block — только сырой JSON-объект.
- Внутри строк JSON не используй реальные переносы строк: только \\n.
- Строго валидный JSON: экранируй переносы строк как \\n, без trailing commas.`
