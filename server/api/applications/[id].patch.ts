import { eq, sql } from "drizzle-orm";
import { APPLICATION_STATUSES, applications } from "~~/server/database/schema";
import type { ApplicationStatus } from "~~/server/database/schema";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id") || "");
  
  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid Application ID.",
    });
  }
  
  const body = await readBody(event);
  
  if (
    !body.status
    || typeof body.status !== "string"
    || !APPLICATION_STATUSES.includes(body.status as ApplicationStatus)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}.`,
    });
  }
  
  const newStatus = body.status as ApplicationStatus;
  
  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.id, id));
    
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: "Application not found.",
    });
  }
  
  try {
    const [updated] = await db
      .update(applications)
      .set({
        status: newStatus,
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
      })
      .where(eq(applications.id, id))
      .returning();
      
    return updated;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update application status.",
    });
  }
});