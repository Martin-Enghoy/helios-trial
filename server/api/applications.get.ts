import { eq, sql, count, asc, desc } from "drizzle-orm";
import { APPLICATION_STATUSES, applications } from "../database/schema";
import type { ApplicationStatus } from "../database/schema";

// Columns for sorting
const SORTABLE_COLUMNS = {
  name: applications.name,
  createdAt: applications.createdAt,
  status: applications.status,
  yearsOfExperience: applications.yearsOfExperience,
  expectedSalary: applications.expectedSalary,
} as const;

type SortableColumn = keyof typeof SORTABLE_COLUMNS;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = 20;
  const offset = (page - 1) * limit;
  
  const sortBy: SortableColumn =
    typeof query.sortBy === "string" && query.sortBy in SORTABLE_COLUMNS
      ? (query.sortBy as SortableColumn)
      : "createdAt";
    
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  
  const statusFilter =
    query.status && APPLICATION_STATUSES.includes(query.status as ApplicationStatus)
      ? (query.status as ApplicationStatus)
      : undefined;
  
  const whereClause = statusFilter
    ? eq(applications.status, statusFilter)
    : undefined;
  
  try {
    const [totalResult] = await db
      .select({ count: count() })
      .from(applications)
      .where(whereClause);
      
    const total = totalResult!.count;
    const totalPages = Math.ceil(total / limit);
    
    const orderFn = sortOrder === "asc" ? asc : desc;
    const column = SORTABLE_COLUMNS[sortBy];
    
    const data = await db
      .select()
      .from(applications)
      .where(whereClause)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset);
      
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch applications."
    });
  }
});