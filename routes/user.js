const { Router } = require("express");
const router = Router();
const {Admin, User, Course} = require("../db");
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/user");
const JWT_SECRET ="secret";

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    })

    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
//     const username = req.body.username;
//     const password = req.body.password;

//     const user = await User.Find({
//         username,
//         password
//     });
//     if(user){
//         res.json({
//             "msg" : "User logged in."
//         })
//     }
//     else {

//     }    
// });


const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    })
    if (user) {
        // const token = jwt.sign({
        //     username
        // }, JWT_SECRET);

        res.json({
            "msg": "Logged in successfully."
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and pass"
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses 
    const courseslist = await Course.find();
    res.json({
        Courses : courseslist
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    });

    console.log(user.purchasedCourses);
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });

    res.json({
        courses: courses
    })
});

module.exports = router