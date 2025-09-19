const getUserClass = (user) => {
    if (!user || !user.class) {
        return "Class not specified";
    }

    let className = user.year;

    if (user.department === "INFT") {
        className += " IT";
    } else if (user.department === "CMPN") {
        className += " CS";
    } else if (user.department === "ECS") {
        className += " ECS";
    } else if (user.department === "EXTC") {
        className += " EXTC";
    }

    console.log("Class Name:", user.class);

    className += " " + (user.class == "Class 1" ? "1" : "2");

    console.log("Final Class Name:", className);

    return className;
};

export default getUserClass;
