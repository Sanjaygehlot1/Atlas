import { mongoose, Schema } from 'mongoose';

const notificationSchema = new Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Cancellation', 'Announcement', 'Assignment', 'Changes'],
        default: 'Announcement'
    },
    relatedLecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Timetable'
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;