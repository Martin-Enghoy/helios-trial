import { applications, NOTICE_PERIODS, NoticePeriod } from "../database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const errors: string[] = [];
  
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    errors.push("Name is required.");
  }
  
  if (!body.currentWork || typeof body.currentWork !== "string" || !body.currentWork.trim()) {
    errors.push("Current Work is required.");
  }
  
  if (
    body.yearsOfExperience === null
    || typeof body.yearsOfExperience !== "number"
    || !Number.isInteger(body.yearsOfExperience)
    || body.yearsOfExperience <= 0 
  ) {
    errors.push("Years of experience must be a positive integer.");
  }
  
  if (!body.noticePeriod || typeof body.noticePeriod !== "string" || !body.noticePeriod.trim()) {
    errors.push(`Notice period must be one of: ${NOTICE_PERIODS.join(", ")}.`);
  }
  
  if (
    body.expectedSalary === null
    || typeof body.expectedSalary !== "number"
    || !Number.isInteger(body.expectedSalary)
    || body.expectedSalary <= 0 
  ) {
    errors.push("Expected Salary must be a positive integer.");
  }
  
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Failed",
      data: { errors },
    });
  }
  
  try {
    const result = await db
      .insert(applications)
      .values({
        name: body.name.trim(),
        currentWork: body.currentWork.trim(),
        yearsOfExperience: body.yearsOfExperience,
        noticePeriod: body.noticePeriod as NoticePeriod,
        expectedSalary: body.expectedSalary,
      })
      .returning();
      
    setResponseStatus(event, 201);
    return result[0];
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create application",
    });
  }
});