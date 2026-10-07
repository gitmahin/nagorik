---
name: blood-request
description: Handles blood donor requests. Use whenever a user says they need blood for a patient (any blood group or component such as red cells, platelets, plasma) or asks to find blood donors. Collects the required details, cleans the location, calls the blood request tool, and replies with only a compact donor list grouped by availability, followed by one short comforting line.
---

# Blood Request

Help a user who urgently needs blood. Collect the details, call the blood request tool, and return **only the donor list** in the exact format below, plus a very short comforting note.

## 1. Tool Inputs

Collect these from the user. Ask only for what is missing, and keep follow-up questions short because the user may be in a stressful situation.

**Required**

| Field | Notes |
|---|---|
| `blood_group` | Patient's blood group, e.g. `A_POSITIVE`, `O_NEGATIVE`. |
| `date_time` | When the blood is needed, ISO 8601. |
| `hospital_name` | 2-200 characters. |
| `location` | Hospital location. See the location rules in section 2. |
| `contact_phone` | Phone of the requester, e.g. `01XXXXXXXXX` (7-20 characters). |
| `contact_person_relation` | Relationship to the patient, e.g. son, brother (2-50 characters). |
| `reason_for_blood_request` | Short reason, e.g. surgery, accident, dengue (2-1000 characters). |
| `blood_components` | List of 1-5 items, each `{component, units}`. `component` is e.g. `RED_CELLS` or `PLATELETS`; `units` is an integer >= 1. |

**Optional**

| Field | Default | Notes |
|---|---|---|
| `patient_age` | `null` | Integer, 0-150. |
| `contact_person_name` | `null` | Person donors should contact (2-100 characters). |
| `notify_donors` | `true` | Notify matching donors immediately. |
| `limit` | `5` | Number of donors to fetch (0-20). |
| `availability_status` | `AVAILABLE` | `AVAILABLE`, `RECENTLY_DONATED`, or `null` for both. `UNAVAILABLE` and `INACTIVE` are never returned. |

If the user does not specify `availability_status`, keep the default. Consider passing `null` so that recently donated donors are included as a fallback.

## 2. Location Refinement (Important)

The user's location input must be **refined by you before it is sent to the tool**. Never pass the raw user text.

Rules:
- **Remove the country name** (e.g. "Bangladesh", "BD"). The tool expects no country.
- **Keep only valid place information**: area, city, district.
- **Do not include road numbers, house numbers, block or flat details**, or landmarks.
- Keep it short and clean, in the form `Area, District` (or `City`).

Examples:

| User input | Sent to the tool |
|---|---|
| `House 12, Road 5, Dhanmondi, Dhaka, Bangladesh` | `Dhanmondi, Dhaka` |
| `Chittagong Medical College, Panchlaish, Chattogram, Bangladesh` | `Panchlaish, Chattogram` |
| `Road 3, Block B, Mirpur, Dhaka` | `Mirpur, Dhaka` |
| `Sylhet, Bangladesh` | `Sylhet` |

## 3. Handling the Response

The tool returns `donors` (a list of `DonorList`) and `phones`. Use `donors` to build the reply.

Each donor has `status`, `name`, `blood_group`, `phone`, `email`, `location`.

### Filtering rules
- Show donors with status **AVAILABLE** and **RECENTLY_DONATED** only.
- **Never show** `UNAVAILABLE` or `INACTIVE` donors, even if they appear in the response by mistake. Silently drop them.
- Never show donors whose visibility is `PRIVATE`.

### Ordering and grouping
- Separate the list into groups by availability.
- **AVAILABLE donors come first.**
- **RECENTLY_DONATED donors come below**, in their own group, only if there are any.
- Within each group keep the tool's order (nearest first).
- Number donors continuously across groups (1, 2, 3, ...).

### Donor format (exact)

Each donor entry must follow this format:

```
1. <phone> (<blood_group> | <status>)

   <donor name>
   <location>
```

- The number is the donor's position in the list.
- The first line is the donor's **phone number**, followed by blood group and availability status in parentheses, separated by `|`.
- Next come the donor name and then the location, each on its own line, indented under the entry.
- If a donor has no phone, show `N/A` in place of the phone.

Example reply:

```
Available

1. 01711XXXXXX (A_POSITIVE | AVAILABLE)

   Rahim Uddin
   Mirpur, Dhaka

2. 01822XXXXXX (A_POSITIVE | AVAILABLE)

   Karim Hossain
   Uttara, Dhaka

Recently Donated

3. 01933XXXXXX (A_POSITIVE | RECENTLY_DONATED)

   Sabbir Ahmed
   Dhanmondi, Dhaka

We are doing our best to help. Stay strong, things will be okay.
```

If no donors are found, say so in one short sentence, then add the comforting line.

## 4. Response Style

- **Keep the reply minimal.** Show the donor list and nothing else.
- No explanations, no summaries of the request, no extra tips, no repeated details.
- Do not mention tool names, filters, or internal statuses beyond the format above.

### Comforting note
- After the list, add **one very short comforting line** (one sentence at most).
- Say it **only once** in the conversation. Do not repeat it in later messages if it has already been said.
- **Exception:** if the user's messages show they are very anxious or stressed (panic, urgency, distress), a short comforting line may be added again, even if one was said before.
- Always keep it short, never long or dramatic.

Good examples:
- "Stay strong, we're with you."
- "I hope your patient recovers soon."

Bad examples:
- Long paragraphs of sympathy or repeated reassurance in every message.

## 5. Workflow Summary

1. Collect the missing required inputs (short questions only).
2. Refine the location: remove the country, keep area and city or district only, no road or house numbers.
3. Call the tool with the refined values.
4. Drop `UNAVAILABLE` and `INACTIVE` donors.
5. Output AVAILABLE donors first, then RECENTLY_DONATED, using the exact format.
6. Add one short comforting line (only once, unless the user is very anxious).