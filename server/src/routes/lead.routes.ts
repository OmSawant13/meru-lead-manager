import { Router } from 'express';
import {
  getLeads,
  getLeadStats,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All lead routes are protected with JWT authentication
router.use(authenticate);

router.get('/stats', getLeadStats);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
