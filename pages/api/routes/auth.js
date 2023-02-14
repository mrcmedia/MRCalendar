'use strict';
const express = require('express');
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const axios  = require('axios');
const config = require('config')
const { base64encode } = require('nodejs-base64');

const router = express.Router();
const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

router.get('/', async (req,res) => {

    const url = await oauth2Client.generateAuthUrl({
        access_type:'offline',
        scope:[
            'openid',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ]
    });
    res.status(200).send({url:url})
})

router.get('/redirect', async (req,res) => {

    const {code} = req.query;
    const {tokens} = await oauth2Client.getToken(code);
    const {email , email_verified , name , picture} = jwt.decode(tokens.id_token);

    if(tokens.refresh_token !== undefined)
    {
        if(tokens.refresh_token.length > 0)
        {
            const base64Email = base64encode(tokens.refresh_token);
            try
            {
                await axios.put(`${process.env.GIT_URL}/${email}`,
                    {
                    "message":"rt auth",
                    "content":base64Email
                    },
                    {
                    headers:{
                    "Authorization":`${process.env.GITPA_TOKEN}`,
                    "Content-Type":"application/json"
                    }
                },)
            }
            catch(err)
            {
                if(err.response.status !== 422)
                {
                    res.statusCode = 302;
                    res.setHeader('Location', req.headers.referer || `/${err.response.statusText}`);
                    res.end();
                    return;
                }
                else
                {
                    try
                    {
                        const sha = await axios.get(`${process.env.GIT_URL}/${email}`,
                        {
                            headers:{
                            "Authorization":`${process.env.GITPA_TOKEN}`,
                            "Content-Type":"application/json"
                            }
                        })

                        await axios.put(`${process.env.GIT_URL}/${email}`,
                            {
                                "message":sha.data.sha,
                                "content":base64Email,
                                "sha":sha.data.sha
                            },
                        {
                            headers:{
                            "Authorization":`${process.env.GITPA_TOKEN}`,
                            "Content-Type":"application/json"
                            }
                        })
                    }
                    catch{};
                }
            }
        }
    }
    
    const token = jwt.sign({
        email:email,
        name:name,
        picture:picture,
        verrified:email_verified
    }, process.env.JWT_SECRET)

    res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth",token , {
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            maxAge: 31536000,
            sameSite:"strict",
            path: "/"
        })
    )
    res.statusCode = 302;
    res.setHeader('Location', req.headers.referer || '/');
    res.end();
    return;
});

router.get('/verify-cookie',(req,res) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    try
    {
        res.status(200).json({data:jwt.verify(cookies.auth,process.env.JWT_SECRET),verrified:true})
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(401).json({message:err.message , verrified:false});
        }
        else
        {
            res.status(401).json({message:err.message , verrified:false});
        }
    }
})

router.get('/get-user', (req,res)=> {
    try
    {
        var cookies = cookie.parse(req.headers.cookie || '');
        res.json(jwt.verify(cookies.auth ,process.env.JWT_SECRET));
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).json(err.message);
        }
    }
});


router.put('/log-out' , (req , res) => {

    res.setHeader(
        "Set-Cookie",
        cookie.serialize("auth",'' , {
            httpOnly:true,
            secure:process.env.NODE_ENV !== "development",
            maxAge: 0,
            sameSite:"strict",
            path: "/"
        })
    )

    res.json('logged-out');
    return;

})

module.exports = router;
