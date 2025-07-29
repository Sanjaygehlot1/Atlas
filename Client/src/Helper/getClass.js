const getUserClass = (user) => {
    if (!user || !user.class) {
        return "Class not specified";
    }

    let className = user.year;
    if (user.department === "INFT") {
        className += " " + "IT";
    } else if (user.department === "CMPN") {
        className += " " + "CS";
    } else if (user.department === "ECS") {
        className += " " + "ECS";
    } else if (user.department === "EXTC") {
        className += " " + "EXTC";
    }

    return className + " " + user.class;

}

export default getUserClass;