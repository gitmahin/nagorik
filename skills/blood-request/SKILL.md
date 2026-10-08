---
name: blood-request
description: Use whenever a user says they need blood for a patient (any blood group or component such as red cells, platelets, plasma) or asks to find blood donors. Collects the required details, resolves natural date and time, cleans the location, calls the `find_blood_donors` tool, and replies with only a compact donor list grouped by availability, followed by one short comforting line.
---

# Blood Request

Help a user who urgently needs blood. Collect the details, call the `find_blood_donors` tool, and return **only the donor list** in the exact format below, plus a very short comforting note.

## 1. Tool Inputs

Tool name: `find_blood_donors`

### Ask the user ONLY for these (if missing)

| Field | Notes |
|---|---|
| `blood_group` | Patient's blood group, e.g. `A_POSITIVE`, `O_NEGATIVE`. |
| `date_time` | When the blood is needed. ISO 8601. See section 2. |
| `location` | Hospital location. See section 3. |
| `contact_phone` | Phone of the requester, e.g. `01XXXXXXXXX`. |
| `reason_for_blood_request` | Short reason, e.g. surgery, accident, dengue. |
| `blood_components` | List of 1-5 items, each `{component, units}`. `component` is e.g. `RED_CELLS` or `PLATELETS`; `units` is an integer >= 1. |

Keep follow-up questions short. Ask for all missing items in a single short message, because the user may be stressed.

### NEVER ask for these

`hospital_name`, `contact_person_relation`, `contact_person_name`, `patient_age`, `notify_donors`, `limit`, `availability_status`.

- Do **not** ask for the user's name, their relationship to the patient, the hospital name, or the patient's age. Not even once.
- If the user did not mention them, **leave them out of the tool call**. The tool has its own defaults.
- If the user did mention them (for example "my brother", "Square Hospital", "age 45"), pass the real value.
- For `availability_status`, keep the tool default unless the user asks otherwise.

## 2. Date and Time Resolution

Users give the time in natural words. Convert it to a full ISO 8601 `date_time` yourself. Never pass the raw words, and never ask the user for an ISO date.

**Get the current date and time first.** Use the current date and time from the context or a date-time tool if one is available. Never guess it. Use the **Asia/Dhaka timezone (UTC+06:00)** unless the user states another one, and include the offset (e.g. `2026-10-08T22:00:00+06:00`).

Rules:
- **"now", "right now", "ASAP", "urgent", "immediately"** -> the current date and time.
- **"today"** with a time -> today at that time. Without a time -> the current date and time.
- **"tomorrow"** with a time -> tomorrow at that time. Without a time -> ask one short question for the time.
- **"tonight"** -> today at 20:00, unless the user gives a time.
- **Weekday names** (e.g. "Friday 3 pm") -> the next upcoming such day at that time.
- **A time only** (e.g. "10 pm") -> the next time it occurs: today if still ahead, otherwise tomorrow.
- **"in 2 hours", "after 3 hours"** -> the current time plus that amount.
- Understand Bangla and Banglish too (e.g. "আজ", "কাল", "আজকে রাত ১০টা", "ekhon", "kal sokal 9 tay").
- If the time is unclear (e.g. "morning" with no hour), ask one short question or use a sensible default.
- Never send a `date_time` in the past.

Examples (assume now is `2026-10-08T14:30:00+06:00`):

| User says | Sent to the tool |
|---|---|
| `now` | `2026-10-08T14:30:00+06:00` |
| `today 8 pm` | `2026-10-08T20:00:00+06:00` |
| `tomorrow 10 pm` | `2026-10-09T22:00:00+06:00` |
| `10 pm` | `2026-10-08T22:00:00+06:00` |
| `in 2 hours` | `2026-10-08T16:30:00+06:00` |

## 3. Location Refinement (Important)

Refine the location **before** sending it to the tool. Never pass the raw user text.

- **Remove the country name** (e.g. "Bangladesh", "BD").
- **Keep only valid place information**: area, city, district.
- **Remove road numbers, house numbers, block or flat details**, and landmarks.
- Keep it short, in the form `Area, District` (or `City`).

| User input | Sent to the tool |
|---|---|
| `House 12, Road 5, Dhanmondi, Dhaka, Bangladesh` | `Dhanmondi, Dhaka` |
| `Chittagong Medical College, Panchlaish, Chattogram, Bangladesh` | `Panchlaish, Chattogram` |
| `Road 3, Block B, Mirpur, Dhaka` | `Mirpur, Dhaka` |
| `Sylhet, Bangladesh` | `Sylhet` |

## 4. Handling the Response

`find_blood_donors` returns `donors` and `phones`. Use `donors` to build the reply. Each donor has `status`, `name`, `blood_group`, `phone`, `email`, `location`.

### Filtering
- Show only **AVAILABLE** and **RECENTLY_DONATED** donors.
- **Never show** `UNAVAILABLE` or `INACTIVE` donors, even if they appear in the response. Silently drop them.
- Never show donors whose visibility is `PRIVATE`.

### Ordering and grouping
- Separate donors into groups by availability.
- **AVAILABLE first.** **RECENTLY_DONATED below**, in its own group, only if there are any.
- Within each group keep the tool's order (nearest first).
- Number donors continuously across groups (1, 2, 3, ...).

### Donor format (exact)

```
1. <phone> (<blood_group> | <status>)

   <donor name>
   <location>
```

- First line: the donor's **phone number**, then blood group and status in parentheses, separated by `|`.
- Then the donor name, then the location, each on its own line, indented.
- If a donor has no phone, show `N/A` in place of the phone.

Example reply:

```
Available

1. 01711XXXXXX (A+ | Available)

   Rahim Uddin
   Mirpur, Dhaka

2. 01822XXXXXX (A+ | Available)

   Karim Hossain
   Uttara, Dhaka

Recently Donated

3. 01933XXXXXX (A+ | Recently Donated)

   Sabbir Ahmed
   Dhanmondi, Dhaka

We are doing our best to help. Stay strong, things will be okay.
```

If no donors are found, say so in one short sentence, then add the comforting line.

## 5. Response Style

- **Keep the reply minimal.** Show the donor list and nothing else.
- No explanations, no summaries of the request, no extra tips, no repeated details.
- Do not mention tool names, filters, or internal statuses beyond the format above.

### Comforting note
- After the list, add **one very short comforting line** (one sentence at most).
- Say it **only once** in the conversation. Do not repeat it if it was already said.
- **Exception:** if the user seems very anxious or stressed (panic, urgency, distress), a short comforting line may be added again.
- Always short, never long or dramatic.

Good: "Stay strong, we're with you." / "I hope your patient recovers soon."
Bad: long paragraphs of sympathy or repeated reassurance in every message.

## 6. Workflow Summary

1. Check which of the six required fields are missing. Ask for them in one short message. Never ask for name, relationship, hospital, or age.
2. Get the current date and time, and convert the user's natural time into ISO 8601 (Asia/Dhaka, +06:00).
3. Refine the location: no country, no road or house numbers, only area and city or district.
4. Call `find_blood_donors`. Leave out fields the user did not mention.
5. Drop `UNAVAILABLE` and `INACTIVE` donors.
6. Output AVAILABLE donors first, then RECENTLY_DONATED, in the exact format.
7. Add one short comforting line (only once, unless the user is very anxious).