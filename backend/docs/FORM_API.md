# FORM API

## Submit Form Response

### POST /form-responses

Submit a filled form (user answers).

**Headers:**
- Authorization: Bearer <access_token>
- Content-Type: application/json

**Body:**
```json
{
  "formId": "string (id of form configuration)",
  "answers": {
    "field1": "value1",
    "field2": 123,
    "...": "..."
  }
}
```

**Response:**
```json
{
  "id": "string",
  "formId": "string",
  "answers": { ... },
  "submittedBy": "string (userId)",
  "submittedAt": "ISO date"
}
```

---

## Get Form Responses

### GET /form-responses?formId=<formId>

Get all responses for a form (admin/editor only).

### GET /form-responses/my

Get all responses submitted by the current user.

---

## Notes

- Only authenticated users can submit form responses.
- Only admin/editor can create/update form configurations.
- User can only submit responses to approved forms.
