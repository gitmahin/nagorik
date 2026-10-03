import { BloodService } from "@/services";
import { tool } from "@langchain/core/tools";
import { BloodZSchema } from "@repo/zod";
import { inject, injectable } from "inversify";

@injectable()
export class BloodTools {
  constructor(
    @inject(BloodService)
    private bloodService: BloodService
  ) {}

  async find_donors_tool() {
    return tool(
      async (params) => {
        const created_blood_request =
          await this.bloodService.createFormattedBloodRequest(params);
        this.bloodService.findDonors({
          requestId: created_blood_request.id as string,
          includeOtherStatuses: params.include_other_statuses,
          limit: params.limit,
        });
      },
      {
        name: "find_blood_donors",
        description: "Find matching blood donors for a blood request.",
        schema: BloodZSchema.CreateBloodRequest,
      }
    );
  }
}
