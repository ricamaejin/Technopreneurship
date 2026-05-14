import Notification, { INotification } from "../models/Notification";

export const createNotification = async (data: {
  userId: string;
  type: INotification['type'];
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: INotification['referenceType'];
}): Promise<INotification> => {
  return Notification.create({
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    referenceId: data.referenceId,
    referenceType: data.referenceType,
    read: false,
  });
};

export const getNotificationsByUserId = async (userId: string): Promise<INotification[]> => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({ userId, read: false });
};

export const markAsRead = async (notificationId: string, userId: string): Promise<INotification | null> => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId: string): Promise<number> => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );
  return result.modifiedCount || 0;
};

export const deleteNotification = async (notificationId: string, userId: string): Promise<boolean> => {
  const result = await Notification.findOneAndDelete({ _id: notificationId, userId });
  return !!result;
};
