
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const { users } = require("../db")


router.post("/signup", [
    check("email", "Please input a valid email")
        .isEmail(),
    check("password", "Please input a password with a min length of 6")
        .isLength({min: 6})
], async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            errors: errors.array()
        })
    }
    let user = users.find((user) => {
        return user.email === email
    });

    if(user) {
        return res.status(400).json({
            "errors": [
                {
                    "msg": "This user already exists",
                }
            ]
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        email,
        password: hashedPassword
    });

    const token = await JWT.sign({ email }, "nfb32iur32ibfqfvi3vf932bg932g932", {expiresIn: 360000});

    res.json({
        token
    })
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body

    let user = users.find((user) => {
        return user.email === email
    });

    if(!user){
        return res.status(422).json({
            errors: [
                {
                    msg: "Invalid Credentials",
                }
            ]
        })
    }
    let isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.status(404).json({
            errors: [
                {
                    msg: "Invalid Credentials" 
                }
            ]
        })
    }
    const token = await JWT.sign({email}, "nikhila88998898989", {expiresIn: 360000})

    res.json({
        token
    })
})



router.get("/all", (req, res) => {
    res.json(users)
})

module.exports = router