let user = JSON.parse(localStorage.getItem("user") || "{}");

if (localStorage.getItem("role") === "admin") {
  user = JSON.parse(localStorage.getItem("admin") || "{}");
} else if (localStorage.getItem("role") === "instructor") {
  user = JSON.parse(localStorage.getItem("instructor") || "{}");
} else if (localStorage.getItem("role") === "student") {
  user = JSON.parse(localStorage.getItem("student") || "{}");
} else if (localStorage.getItem("role") === "parent") {
  user = JSON.parse(localStorage.getItem("parent") || "{}");
} else if (localStorage.getItem("role") === "teacher") {
  user = JSON.parse(localStorage.getItem("teacher") || "{}");
}

const requestConfig = {
    headers : {
        authorization : "Bearer " + user.accessToken || "",
        "Content-Type": "application/x-www-form-urlencoded",
    }
}


export default requestConfig;