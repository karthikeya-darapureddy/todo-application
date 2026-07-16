const router      = require('express').Router();
const tasks       = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const upload      = require('../middleware/upload');

// All routes protected
router.use(protect);

router.get   ('/',              tasks.getTasks);
router.get   ('/stats',         tasks.getStats);
router.get   ('/:id',           tasks.getTaskById);
router.post  ('/',              upload.array('attachments', 5), tasks.createTask);
router.put   ('/:id',           upload.array('attachments', 5), tasks.updateTask);
router.delete('/:id',           tasks.deleteTask);
router.patch ('/:id/status',    tasks.updateStatus);
router.patch ('/:id/archive',   tasks.archiveTask);
router.patch ('/:id/restore',   tasks.restoreTask);
router.post  ('/:id/duplicate', tasks.duplicateTask);

module.exports = router;
