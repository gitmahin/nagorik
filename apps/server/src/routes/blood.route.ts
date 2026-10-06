import type { IRouter } from "@/blueprints";
import { BloodController } from "@/controllers/blood.controller";
import { asyncHandler } from "@/utils";
import { Router } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class BloodRouter implements IRouter {
  private router: Router;
  constructor(
    @inject(BloodController)
    private bloodController: BloodController
  ) {
    this.router = Router();
  }

  createRouters(): void {
    this.router
      .route("/")
      .post(
        asyncHandler(
          this.bloodController.createBloodRequest.bind(this.bloodController)
        )
      );
    // RESPONSE
    // {
    //   "status": 201,
    //   "message": "Created",
    //   "data": {
    //     "id": "1b93dd3d-2f00-4eff-af63-2188f9202486",
    //     "user_id": "5a281640-4dda-4b9c-b1cb-fc645291b97f",
    //     "blood_group": "B_POSITIVE",
    //     "hash": "05756d912efc60bd44b66b94b3ecc06d2eb6311a5b0eacb80fb1908b5f820051",
    //     "patient_age": 54,
    //     "number_of_bags": null,
    //     "date_time": "2026-10-07T04:00:00.000Z",
    //     "hospital_name": "Square Hospital",
    //     "location": "Panthapath, Dhaka",
    //     "lat": 23.7528726,
    //     "lon": 90.3827508,
    //     "contact_phone": "01712345678",
    //     "contact_person_name": "Rahim Uddin",
    //     "contact_person_relation": "son",
    //     "reason_for_blood_request": "Heart surgery scheduled for tomorrow morning",
    //     "updated_at": "2026-10-06T09:19:20.799Z",
    //     "created_at": "2026-10-06T09:19:20.799Z",
    //     "blood_components": [
    //       {
    //         "id": "12f02622-66f8-4ad5-aa5d-6dd4b1f18ffd",
    //         "component": "RED_CELLS",
    //         "units": 2,
    //         "blood_request": "1b93dd3d-2f00-4eff-af63-2188f9202486",
    //         "updated_at": "2026-10-06T09:19:21.066Z",
    //         "created_at": "2026-10-06T09:19:21.066Z"
    //       },
    //       {
    //         "id": "fdc6287e-9ca5-4bb9-b83d-28c4326a1c16",
    //         "component": "PLATELETS",
    //         "units": 1,
    //         "blood_request": "1b93dd3d-2f00-4eff-af63-2188f9202486",
    //         "updated_at": "2026-10-06T09:19:21.066Z",
    //         "created_at": "2026-10-06T09:19:21.066Z"
    //       }
    //     ]
    //   },
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/:user_id/:blood_group")
      .get(
        asyncHandler(
          this.bloodController.getBloodRequestHandler.bind(this.bloodController)
        )
      );
    // RESPONSE
    // {
    //   "status": 200,
    //   "message": "Ok",
    //   "data": {
    //     "id": "1b93dd3d-2f00-4eff-af63-2188f9202486",
    //     "user_id": "5a281640-4dda-4b9c-b1cb-fc645291b97f",
    //     "blood_group": "B_POSITIVE",
    //     "hash": "05756d912efc60bd44b66b94b3ecc06d2eb6311a5b0eacb80fb1908b5f820051",
    //     "patient_age": 54,
    //     "number_of_bags": null,
    //     "date_time": "2026-10-07T04:00:00.000Z",
    //     "hospital_name": "Square Hospital",
    //     "location": "Panthapath, Dhaka",
    //     "lat": 23.7528726,
    //     "lon": 90.3827508,
    //     "contact_phone": "01712345678",
    //     "contact_person_name": "Rahim Uddin",
    //     "contact_person_relation": "son",
    //     "reason_for_blood_request": "Heart surgery scheduled for tomorrow morning",
    //     "updated_at": "2026-10-06T09:19:20.799Z",
    //     "created_at": "2026-10-06T09:19:20.799Z"
    //   },
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/donors")
      .post(
        asyncHandler(
          this.bloodController.createDonorHandler.bind(this.bloodController)
        )
      );
    // RESPONSE
    // {
    //   "status": 201,
    //   "message": "Created",
    //   "data": {
    //     "id": "42df3676-9770-4868-948c-6b88fd4c17ed",
    //     "user_id": "5a281640-4dda-4b9c-b1cb-fc645291b97f",
    //     "location": "Mirpur, Dhaka",
    //     "lat": 23.8123629,
    //     "lon": 90.3640891,
    //     "phone": "01712345678",
    //     "email": "rahim.uddin@example.com",
    //     "blood_group": "B_POSITIVE",
    //     "active_status": "AVAILABLE",
    //     "donation_count": 0,
    //     "donor_visibility": "PUBLIC",
    //     "updated_at": "2026-10-06T09:24:48.889Z",
    //     "created_at": "2026-10-06T09:24:48.889Z",
    //     "name": "Rahim Uddin"
    //   },
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/donors/:donor_id")
      .patch(
        asyncHandler(
          this.bloodController.updateDonorHandler.bind(this.bloodController)
        )
      );
    // RESPONSE
    //     {
    //   "status": 200,
    //   "message": "Updated",
    //   "data": {
    //     "id": "42df3676-9770-4868-948c-6b88fd4c17ed",
    //     "user_id": "5a281640-4dda-4b9c-b1cb-fc645291b97f",
    //     "location": "Uttara, Dhaka",
    //     "lat": 23.8693275,
    //     "lon": 90.3926893,
    //     "phone": "01898765432",
    //     "email": "rahim.new@example.com",
    //     "blood_group": "B_POSITIVE",
    //     "active_status": "AVAILABLE",
    //     "donation_count": 0,
    //     "donor_visibility": "PUBLIC",
    //     "updated_at": "2026-10-06T09:33:31.647Z",
    //     "created_at": "2026-10-06T09:24:48.889Z"
    //   },
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/donors/find/queries")
      .get(
        asyncHandler(
          this.bloodController.findDonorsByQueryParamsHandler.bind(
            this.bloodController
          )
        )
      );
    // RESPONSE
    //     {
    //   "status": 200,
    //   "message": "Ok",
    //   "data": [
    //     {
    //       "id": "d2756ef6-97af-417d-a07f-6a69aa5795cd",
    //       "name": "Karim Hossain",
    //       "location": "Dhanmondi, Dhaka",
    //       "phone": "01711000002",
    //       "email": null,
    //       "bloodGroup": "O_NEGATIVE",
    //       "activeStatus": "AVAILABLE"
    //     },
    //     {
    //       "id": "bf8f8c24-8b21-4880-b28c-dfa2e83181b0",
    //       "name": "Mim Chowdhury",
    //       "location": "Mymensingh Sadar, Mymensingh",
    //       "phone": "01811000013",
    //       "email": "mim.chowdhury@example.com",
    //       "bloodGroup": "O_NEGATIVE",
    //       "activeStatus": "AVAILABLE"
    //     }
    //   ],
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/donors/find/ids")
      .get(
        asyncHandler(
          this.bloodController.findDonorsByIdsHandler.bind(this.bloodController)
        )
      );

    // RESPONSE
    //       {
    //   "status": 200,
    //   "message": "Ok",
    //   "data": [
    //     {
    //       "id": "d2756ef6-97af-417d-a07f-6a69aa5795cd",
    //       "name": "Karim Hossain",
    //       "location": "Dhanmondi, Dhaka",
    //       "phone": "01711000002",
    //       "email": null,
    //       "bloodGroup": "O_NEGATIVE",
    //       "activeStatus": "AVAILABLE"
    //     },
    //     {
    //       "id": "bf8f8c24-8b21-4880-b28c-dfa2e83181b0",
    //       "name": "Mim Chowdhury",
    //       "location": "Mymensingh Sadar, Mymensingh",
    //       "phone": "01811000013",
    //       "email": "mim.chowdhury@example.com",
    //       "bloodGroup": "O_NEGATIVE",
    //       "activeStatus": "AVAILABLE"
    //     }
    //   ],
    //   "success": true,
    //   "title": ""
    // }

    this.router
      .route("/donors/:donor_id")
      .delete(
        asyncHandler(
          this.bloodController.deleteDonorHandler.bind(this.bloodController)
        )
      );
  }

  getRouters(): Router {
    return this.router;
  }
}
