from dotenv import load_dotenv
load_dotenv()
from typing import Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser
from schemas.blood_tools_schemas import DonorMatchResult, BloodComponentInput
from constants.blood_constants import BloodGroup
from langsmith import traceable
from datetime import datetime
import json
from libs.agents import blood_agent
from utils.get_agent_res_content import get_agent_res_content
from langchain_core.runnables import RunnableLambda

parser = StrOutputParser()
donor_match_result_parser = PydanticOutputParser(pydantic_object=DonorMatchResult)

class BloodService:
    # def find_donors_by_agent(
    #         self,
    #         blood_group: BloodGroup,
    #         number_of_bags: int,
    #         date_time: datetime,
    #         hospital_name: str,
    #         location: str,
    #         contact_phone: str,
    #         contact_person_relation: str,
    #         reason_for_blood_request: str,
    #         blood_components: list[BloodComponentInput],
    #         patient_age: int | None = None,
    #         contact_person_name: str | None = None,
    #         notify_donors: bool = True,
    #         donors: list[Any] | None = None
    # ) -> DonorMatchResult:
    #     chat_template = ChatPromptTemplate.from_messages(
    #        [
    #            ("human",
    #              """A blood request happened. Find matching donors using the donor-matching skill.
    #                 Blood request:
    #                 - Blood group: {blood_group}
    #                 - Bags needed: {number_of_bags}
    #                 - Needed by: {date_time}
    #                 - Hospital: {hospital_name}
    #                 - Location (search center): {location}
    #                 - Requested components: {blood_components}
    #                 - Reason: {reason_for_blood_request}
    #                 - Patient age: {patient_age}
    #                 - Contact person: {contact_person_name} ({contact_person_relation})
    #                 - Contact phone: {contact_phone}
    #                 - Notify donors: {notify_donors}
    #
    #                 Donor list (retrieved from the database):
    #                 {donors}
    #
    #                 Instructions:
    #                 {instructions}
    #                 """)
    #        ]
    #     ).partial(
    #         blood_group=blood_group.value,
    #         number_of_bags=number_of_bags,
    #         date_time=date_time.isoformat(),
    #         hospital_name=hospital_name,
    #         location=location,
    #         blood_components=", ".join(f"{c.component.value} x{c.units}" for c in blood_components),
    #         reason_for_blood_request=reason_for_blood_request,
    #         patient_age=patient_age if patient_age is not None else "N/A",
    #         contact_person_name=contact_person_name or "N/A",
    #         contact_person_relation=contact_person_relation,
    #         contact_phone=contact_phone,
    #         notify_donors=notify_donors,
    #         donors=json.dumps(donors, default=str),
    #         instructions=donor_match_result_parser.get_format_instructions()
    #     )
    #
    #     chain = chat_template | blood_agent | RunnableLambda(get_agent_res_content) | donor_match_result_parser
    #
    #     @traceable(name="find_matched_donors", run_type="chain")
    #     def invoke_chain() -> DonorMatchResult:
    #         return chain.invoke({})
    #
    #     agent_response = invoke_chain()
    #     return agent_response

    pass
