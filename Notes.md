```javascript
const express = require("express");
```

```javascript
const app = express();
```

- request handler
- this will only handle GET call to /user

```javascript
app.get("/user", (req, res) => {
  console.log(req.query);
  res.send({ firstName: "Mohd", lastName: "Faraz" });
});
```

```javascript
app.post("/user", (req, res) => {
  // console.log("Save data to the database.")
  // save data to DB
  res.send("User data saved successfully.");
});
```

```javascript
app.delete("/user", (req, res) => {
  res.send("data deleted successfully.");
});
```

- this will match all the HTTP method API call to /test

```javascript
app.use("/test", (req, res) => {
  res.send("hello from the test dashboard!!");
});
```

```javascript
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

- you can add as many as route in array.

```javascript
app.use("/route", rH, rH2, rH3, rH4, [rH5, rH6]);
```

```javascript
app.use("/user", [
  (req, res, next) => {
    console.log("Handling the route user 1!!");
    next();
    // res.send("response 1");
  },
  (req, res, next) => {
    console.log("Handling the route user 2!!");
    // res.send("Response 2");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 3!!");
    // res.send("Response 3");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user 4!!");
    res.send("Response 4");
  },
]);
```

- What is middleware.?
- ANS - Middleware is software that acts as a bridge between an operating system and applications, facilitating communication and data management.
- How express js basically handles request the Behind the scene.

```javascript
app.get("/admin/getAllData", (req, res) => {
  // Logic of checking if the request is authorized
  const token = "xyzgkdgcb";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    res.send("All Data Sent.");
  } else {
    res.status(401).send("Unauthorized Access.");
  }
});
```

```javascript
// Handle Auth middleware for all GET, POST, .... request
app.use("/admin", (req, res, next) => {
  const token = "xyziugwifu";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized Access.");
  } else {
    next();
  }
});

app.get("/admin/getAllData", (req, res) => {
  // Logic of checking if the request is authorized
  res.send("All Data Sent.");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("All Data Delete.");
});
```

### HANDLING ERROR

```javascript
app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});
```

```javascript
app.get("/getUserData", (req, res) => {
  try {
    // Logic of DB call and get user data

    throw new Error("dfbdsldks");
    res.send("User Data sent.");
  } catch (err) {
    res.status(500).send("something went wrong.");
  }
});
```

#### DATABSE CONNECTION

- First connect to the database then start listening on the port. (// This is important .!!!)

- make config folder
- second make database.js file in config folder.
- then do this in database.js file.

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Faraz21:*******@namastenodejs.tnlmt.mongodb.net/devTinder"
  );
};
module.exports = connectDB;
```

- after that in app.js folder do this

```javascript
const express = require("express");
const connectDB = require("./config/database");
const app = express();

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connot to be connected....");
  });
```

### Making UserSchema

- first make src/models folder
- second in models folder make user.js file
- then do this in user.js file

```javascript
//  this is user schema models folder.
// userSchema
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

// module.exports = User (isko use kr bhi sakte hai aur nahi bhi.);
```

- After this make /POST Api call for dummy data in App.js file.

```javascript
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // Creating a new instance of user model
  const user = new User({
    firstName: "Faraz",
    lastName: "Mohammad",
    email: "faraz@example.com",
    password: "123456",
  });
  // return a promise
  await user.save();
  res.send("User created successfully...")
});

 - OR ALWAYS DO IN TRY CATCH BLOCK error handling.(this is important!! and easy to understand.)
 try {
    await user.save();
    res.send("User created successfully...");
  } catch (err) {
    res.status(404).send("Error creating user");
  }

```

- ALWAYS DO ERROR HANDLING WHEN YOU INTERACT WITH THE DATABASE

```javascript
//  dynamic API call it is a middleware for creating a dynamic data, for seeing js file.
app.use(express.json());
```

```javascript
//  Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Error getting user!!");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // Ensure the query executes properly
    if (users.length === 0) {
      return res.status(404).send("No users found");
    }
    console.log(users); // Debug: Log users
    res.send(users);
  } catch (err) {
    console.error(err); // Debug: Log the error
    res.status(500).send("Something went wrong..!!");
  }
});

// delete user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  // const userExists = await User.findById(userId);
  // console.log(userExists);
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send(user);
  } catch (err) {
    res.status(404).send("Error deleting user");
  }
});

// Update the data of user
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const updatedData = req.body;
  console.log(updatedData);
  try {
    const user = await User.findByIdAndUpdate(userId, updatedData);
    res.send(user);
  } catch (err) {
    res.status(404).send("Error updating user");
  }
});
```

- Always validate your api every possible level.
- for validation use npm validator library it is very helpful..
- Do validation in try catch block.
```javascript
// API Level Validation
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updatedData = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updatedData).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed.");
    }
    if (updatedData?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10 characters.");
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully.!!");
  } catch (err) {
    res.status(404).send("UPDATE FAILED:" + err.message);
  }
});
```

##### SCHEMA LEVEL VALIDATION

- explore validator library functions.
- NEVER TRUST ON req.body because it is damage by many mislenious userss.
- This validation is done with the help of validator library.

```javascript
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email!: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter Strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid.!!");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!!!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamp: true,
  }
);
```

### ENCRYPTION PASSWORD


- after making api fuction app.post("/signup") .
- first validate the data.
- then Encrypt the password.
- make utils folder in src folder
- then make validation.js file in utils folder
- after that do all the validations.

```javascript
// validation.js file code
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough!!!.");
  }
};
module.exports = {
  validateSignUpData,
};
```

- FOR ENCRYPTING PASSWORD USE NPM BCRYPT LIBRARY
-  This library used  hashing to secure the password.

```javascript
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //  Validation of  Data
  try {
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); // here 10 is SaltRound is hashing technique to secure the password.
    console.log(passwordHash);

    // Creating a new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    // return a promise
    await user.save();
    res.send("User created successfully...");
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});
```

```javascript
// LOGIN API's with authentication
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("logged in successfull....");
    } else {
      throw new Error("INVALID CREDENTIALS.");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});
```
```javascript
app.use(cookieParser()); //reading cookie -> first import this then use this for reading.
```

 ##### JWT Authentication
```javascript
const jwt = require("jsonwebtoken");
```


```javascript
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
    // Create a jwt Token

      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$18");
      console.log(token);

      // Add the token to cookie and send the response
      res.cookie("token", token);

      res.send("logged in successfull....");
    } else {
      throw new Error("INVALID CREDENTIALS.");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token) {
      throw new Error("Invalid!!")
    }
    // Validate my token
    const isTokenValid = await jwt.verify(token, "DEV@TINDER$18");
    // console.log(isTokenValid);
    const { _id } = isTokenValid;
    // console.log("Logged In user is: " + _id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);

  }
  catch (err) {
    res.status(404).send("ERROR: " + err.message)
  }
});

```
- shift + alt + A (multiple line shrcut)

##### MAKING AUTHENTICATION MIDDLEWARE
- first thing goto the auth.js file.
- second make userAuth function 
 - then first Read the token from the req cookies
 - second Verify the token
 - third Find the user.
 then exports
```Javascript 
 const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // Read the token from the req cookies

  try {
    const { token } = req.cookies;
    if(!token) {
      throw new Error("Token is not provided.");
    }

    // Validate the token
    const decodeObj = await jwt.verify(token, "DEV@TINDER$18");

    // Find the user
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
```
```javascript
//  use of middleware Authentication. in app.js file in api's
app.get("/profile", userAuth, async (req, res) => {
  try {
   const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});
```

#### SCHEMA METHODS
 - for better clean code.
 - this will done in user.js file

 ```javascript
// create mongoose schema {don't use arrow function}
user.Schema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$18");
  // console.log(token);
  return token;
};

user.Schema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
const User = mongoose.model("user", userSchema);

module.exports = User;
```
- use of user schema in this code.
```javascript

// use of  userschema methods
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("INVALID CREDENTIALS.");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a jwt Token
      const token = await user.getJWT();

      // Add the token to cookie and send the response
      res.cookie("token", token);
      res.send("logged in successfull....");
    } else {
      throw new Error("INVALID CREDENTIALS.");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

```

```javascript
//  Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // Ensure the query executes properly
    if (users.length === 0) {
      return res.status(404).send("No users found");
    }
    console.log(users); // Debug: Log users
    res.send(users);
  } catch (err) {
    console.error(err); // Debug: Log the error
    res.status(500).send("Something went wrong..!!");
  }
});
//  delete the user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  // const userExists = await User.findById(userId);
  // console.log(userExists);
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send(user);
  } catch (err) {
    res.status(404).send("Error deleting user");
  }
});

// Update the data of user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updatedData = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(updatedData).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed.");
    }
    if (updatedData?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10 characters.");
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully.!!");
  } catch (err) {
    res.status(404).send("UPDATE FAILED:" + err.message);
  }
});

```