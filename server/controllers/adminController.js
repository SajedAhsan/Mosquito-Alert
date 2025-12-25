const Report = require('../models/Report');
const User = require('../models/User');

/**
 * @route   GET /api/admin/analytics/overview
 * @desc    Get overview statistics
 * @access  Private (Admin)
 */
exports.getOverview = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const validReports = await Report.countDocuments({ status: 'VALID' });
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });
    const inProgressReports = await Report.countDocuments({ status: 'IN_PROGRESS' });
    const clearedReports = await Report.countDocuments({ status: 'CLEARED' });

    res.json({
      totalReports,
      totalUsers,
      validReports,
      pendingReports,
      inProgressReports,
      clearedReports,
    });
  } catch (error) {
    console.error('Get Overview Error:', error.message);
    res.status(500).json({ message: 'Server error fetching overview' });
  }
};

/**
 * @route   GET /api/admin/analytics/weekly-reports
 * @desc    Get reports count for last 7 days
 * @access  Private (Admin)
 */
exports.getWeeklyReports = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reports = await Report.aggregate([
      {
        $match: { date: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for chart
    const chartData = reports.map(item => ({
      date: item._id,
      count: item.count,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Get Weekly Reports Error:', error.message);
    res.status(500).json({ message: 'Server error fetching weekly reports' });
  }
};

/**
 * @route   GET /api/admin/analytics/breeding-distribution
 * @desc    Get breeding type distribution
 * @access  Private (Admin)
 */
exports.getBreedingDistribution = async (req, res) => {
  try {
    const distribution = await Report.aggregate([
      {
        $group: {
          _id: '$breedingType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format for pie chart (Recharts expects 'name' and 'value')
    const chartData = distribution.map(item => ({
      name: item._id,
      value: item.count,
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Get Breeding Distribution Error:', error.message);
    res.status(500).json({ message: 'Server error fetching distribution' });
  }
};

/**
 * @route   GET /api/admin/analytics/area-risk
 * @desc    Get area-wise risk levels
 * @access  Private (Admin)
 */
exports.getAreaRisk = async (req, res) => {
  try {
    const areaReports = await Report.aggregate([
      {
        $group: {
          _id: '$location',
          reportCount: { $sum: 1 },
          highSeverityCount: {
            $sum: { $cond: [{ $eq: ['$severity', 'High'] }, 1, 0] }
          },
          validCount: {
            $sum: { $cond: [{ $eq: ['$aiVerdict', 'VALID'] }, 1, 0] }
          }
        }
      },
      { $sort: { reportCount: -1 } },
      { $limit: 10 }
    ]);

    // Calculate risk level for each area
    const riskData = areaReports.map(area => {
      let riskLevel = 'Low';
      const riskScore = (area.reportCount * 2) + (area.highSeverityCount * 3) + (area.validCount * 2);

      if (riskScore >= 15) {
        riskLevel = 'High';
      } else if (riskScore >= 8) {
        riskLevel = 'Medium';
      }

      return {
        location: area._id,
        reportCount: area.reportCount,
        riskLevel,
        riskScore,
      };
    });

    res.json(riskData);
  } catch (error) {
    console.error('Get Area Risk Error:', error.message);
    res.status(500).json({ message: 'Server error fetching area risk' });
  }
};

/**
 * @route   GET /api/admin/leaderboard
 * @desc    Get top contributors (users with most points)
 * @access  Private (Admin)
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name email points')
      .sort({ points: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (error) {
    console.error('Get Leaderboard Error:', error.message);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};
