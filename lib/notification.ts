import webpush from 'web-push';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import Notification from '@/models/Notification'; // 1. Import Model
import connectDB from '@/lib/db';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export const sendNotification = async (userId: string, title: string, body: string, url: string = "/") => {
  try {
    await connectDB();

    // 2. SAVE TO DATABASE (History)
    await Notification.create({
      userId,
      title,
      message: body,
      link: url,
      isRead: false
    });

    // 3. SEND WEB PUSH (Real-time)
    const subscriptions = await Subscription.find({ userId });
    const notificationPayload = JSON.stringify({ title, body, url });

    const promises = subscriptions.map((sub) =>
      webpush.sendNotification(sub, notificationPayload).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.findByIdAndDelete(sub._id);
        }
      })
    );

    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const notifyAdmins = async (title: string, body: string) => {
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await sendNotification(admin._id.toString(), title, body, "/admin/dashboard");
  }
};