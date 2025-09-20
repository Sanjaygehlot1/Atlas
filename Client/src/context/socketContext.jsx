import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Your existing AuthContext
import { App } from 'antd';
import getUserClass from '../Helper/getClass';
import { CheckCircleTwoTone, CloseCircleTwoTone, EnvironmentTwoTone } from "@ant-design/icons";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const { notification } = App.useApp();
  const [lectureUpdate, setLectureUpdate] = useState(null);

    useEffect(() => {
        console.log("User in SocketProvider:", user);
        if (user && user.class) {
            const newSocket = io("http://localhost:8000", {
                transports: ['websocket', 'polling'],
                withCredentials: true, 
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });



            console.log(newSocket.connected)

            setSocket(newSocket);

            const className = getUserClass(user);
            console.log("11", className)
            newSocket.emit('join_class_room', className);

            

            newSocket.on("lecture_update", async (data) => {
                console.log("Received lecture_update:", data);

                setLectureUpdate({status : data.status, newVenue : data.newVenue, lectureId : data.lectureId});

                let icon, description;
                

                if (data.status === "Cancelled") {
                    icon = <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: "20px" }} />;
                    description = (
                        <div>
                            <span>
                                <b>{data.lecture} Lecture </b>  has been{" "}
                                <b style={{ color: "#ff4d4f" }}>{data.status}</b>.
                            </span>
                        </div>
                    );
                } else if (data.newVenue) {
                    icon = <EnvironmentTwoTone twoToneColor="#1890ff" style={{ fontSize: "20px" }} />;
                    description = (
                        <div>
                            <span>
                                {data.lecture} Lecture has been shifted to{" "}
                                <b style={{ color: "#1890ff" }}>{data.newVenue}</b>.
                            </span>
                        </div>
                    );
                } else {
                    icon = <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "20px" }} />;
                    description = (
                        <div>
                            <span>
                                {data.lecture} Lecture has been :{" "}
                                <b style={{ color: "#52c41a" }}>{data.status}</b>.
                            </span>
                        </div>
                    );
                }

                notification.open({
                    message: (
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                            {data.title || "Lecture Update"}
                        </span>
                    ),
                    description,
                    icon,
                    style: {
                        borderRadius: "12px",
                        background: "#f9f9f9",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                    placement: "topRight",
                    duration: 5, 
                });
            });


            return () => newSocket.disconnect();
        }
    }, [user, notification]);

    return (
        <SocketContext.Provider value={{socket, lectureUpdate}}>
            {children}
        </SocketContext.Provider>
    );
};