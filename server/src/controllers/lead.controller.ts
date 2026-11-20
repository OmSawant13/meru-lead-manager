import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma';
import {
  createLeadSchema,
  updateLeadSchema,
  queryLeadsSchema,
} from '../validators/lead.validator';
import { AppError } from '../middleware/error.middleware';

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const query = queryLeadsSchema.parse(req.query);

    const { page, limit, search, status, source, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where: Prisma.LeadWhereInput = {
      userId,
    };

    if (status && status !== 'All') {
      where.status = status;
    }

    if (source && source !== 'All') {
      where.source = source;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { email: { contains: term } },
        { company: { contains: term } },
        { phone: { contains: term } },
      ];
    }

    // Execute count and query in parallel transaction for high performance
    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [total, newCount, contactedCount, qualifiedCount, lostCount] =
      await Promise.all([
        prisma.lead.count({ where: { userId } }),
        prisma.lead.count({ where: { userId, status: 'New' } }),
        prisma.lead.count({ where: { userId, status: 'Contacted' } }),
        prisma.lead.count({ where: { userId, status: 'Qualified' } }),
        prisma.lead.count({ where: { userId, status: 'Lost' } }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: {
          New: newCount,
          Contacted: contactedCount,
          Qualified: qualifiedCount,
          Lost: lostCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const lead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!lead) {
      throw new AppError('Lead not found or unauthorized to view', 404);
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const validatedData = createLeadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const validatedData = updateLeadSchema.parse(req.body);

    const existingLead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existingLead) {
      throw new AppError('Lead not found or unauthorized to update', 404);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existingLead = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existingLead) {
      throw new AppError('Lead not found or unauthorized to delete', 404);
    }

    await prisma.lead.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
