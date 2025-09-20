import { mongoose, Schema } from 'mongoose';

const notificationSchema = new Schema({
    recipientClass: {
        type: String,
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
        type: String,
        default: null
    },
    sender: {
        type: String,
        default: 'Admin'
    },
    date : {
        type: Date,
        default: Date.now
    },
    time : {
        type: String,
        default: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;