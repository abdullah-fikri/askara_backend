const Product = require('../models/Product');
const Career = require('../models/Career');

// Target execution hour at night (02:00 AM)
const TARGET_HOUR = 2;

/**
 * Perform queries (Product & Career) to keep the database active and prevent suspension
 */
async function pingDatabase() {
  try {
    console.log('[Scheduler] 🌙 Running scheduled database keep-alive query (Product & Career)...');
    await Promise.allSettled([
      Product.findAll({ activeOnly: true }),
      Career.findAll({ activeOnly: true }),
    ]);
    console.log('[Scheduler] ✅ Daily database keep-alive query completed successfully.');
  } catch (error) {
    console.error('[Scheduler] ❌ Failed to execute keep-alive query:', error.message);
  }
}

/**
 * Schedule the task to run once daily at 02:00 AM
 */
function startDailyScheduler() {
  const scheduleNextRun = () => {
    const now = new Date();
    const nextRun = new Date();

    // Set target time to 02:00:00 today
    nextRun.setHours(TARGET_HOUR, 0, 0, 0);

    // If 02:00 AM today has already passed, schedule for tomorrow
    if (now >= nextRun) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();
    const hoursLeft = (delayMs / (1000 * 60 * 60)).toFixed(1);

    console.log(`⏰ Daily Scheduler active: Next run scheduled at ${nextRun.toLocaleTimeString()} (in ~${hoursLeft} hours).`);

    setTimeout(async () => {
      await pingDatabase();
      scheduleNextRun(); // Automatically schedule for the next day
    }, delayMs);
  };

  scheduleNextRun();
}

module.exports = {
  startDailyScheduler,
  pingDatabase,
};
