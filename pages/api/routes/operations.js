const { default: axios } = require('axios');
const express = require('express')
const {google} = require('googleapis')
const { base64decode, base64encode } = require('nodejs-base64');
const config = require('config')
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const {VerifyError} = require('../../../utils/CustomErrors')

const {OAuth2} = google.auth;

const router = express.Router();

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
)

function Verrify(request)
{
    if(request.headers.cookie === undefined) throw new Error('Invalid Headers'); 
    const auth_cookie = cookie.parse(request.headers.cookie).auth;
    var {summary , description , startDate , endDate ,location ,birthdayPerson , birthdaydescription , dateofbirth} = request.body;
    try
    {
        if(summary && description && startDate && endDate && location)
        {
            if(auth_cookie)
            {
                const email = jwt.verify(auth_cookie , process.env.JWT_SECRET).email
                return {summary , description , startDate , endDate , location , email};
            }
            else{
                throw new VerifyError('Cookie error')
            }
        }
        else if (birthdayPerson && birthdaydescription && dateofbirth)
        {
            if(auth_cookie)
            {
                const email = jwt.verify(auth_cookie , process.env.JWT_SECRET).email
                return {summary:birthdayPerson , description:birthdaydescription , startDate:dateofbirth , endDate:dateofbirth , email , location:'Pitipana Homagama, Sri Lanka'};
            }
            else{
                throw new VerifyError('Cookie error')
            }
        }
        else
        {
            if(auth_cookie)
            {
                const email = jwt.verify(auth_cookie , process.env.JWT_SECRET).email
                return {email}
            }
            else
            {
                throw new Error(`form body isn't in the current format`)
            }
        }
    }
    catch(err)
    {
        throw new Error(err.message);
    }
}

router.post('/create-event', async (req,res) => {
    try
    {
        const {summary , description , startDate , endDate ,location , email} = Verrify(req);
        const rt = await axios.get(`${process.env.GIT_URL}/${email}`,
        {
            headers:{
            "Authorization":`${process.env.GITPA_TOKEN}`,
            "Content-Type":"application/json"
            }
        });
        const refresh_token = base64decode(rt.data.content)
        oauth2Client.setCredentials({
            refresh_token:refresh_token
        })

        const calendar = google.calendar({version:'v3' , auth:oauth2Client})

        const bas64Description = base64encode(JSON.stringify({
            type:"Event",
            description:description
        }))

        const response = await calendar.events.insert({
            calendarId:'primary',
            requestBody:{
                summary:summary,
                location:location,
                description:bas64Description,
                start:{
                    dateTime:new Date(startDate)
                },
                end:{
                    dateTime:new Date(endDate)
                },
                colorId:Math.floor(Math.random() * 12),
            }
        })
        res.status(response.status).json(response.data);
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).json(err.response);
        }
        else if(err instanceof VerifyError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof Error)
        {
            res.status(400).json(err.message);
        }
        else
        {
            res.status(err.response.status).json(err.message)
        }
    }
});



router.post('/create-birthday', async (req,res) => {


    try
    {
        const {summary , description , startDate , endDate ,location , email} = Verrify(req);
        const rt = await axios.get(`${process.env.GIT_URL}/${email}`,
        {
            headers:{
            "Authorization":`${process.env.GITPA_TOKEN}`,
            "Content-Type":"application/json"
            }
        });
        const refresh_token = base64decode(rt.data.content)
        oauth2Client.setCredentials({
            refresh_token:refresh_token
        })

        const calendar = google.calendar({version:'v3' , auth:oauth2Client})

        const bas64Description = base64encode(JSON.stringify({
            type:"Birthday",
            description:description
        }))

        const response = await calendar.events.insert({
            calendarId:'primary',
            requestBody:{
                summary:summary,
                location:location,
                description:bas64Description,
                start:{
                    dateTime:new Date(Date.parse(startDate))
                },
                end:{
                    dateTime:new Date(Date.parse(endDate))
                },
                colorId:Math.floor(Math.random() * 12)
            }
        })
        res.status(response.status).json(response.data);
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof VerifyError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof Error)
        {
            res.status(400).json(err.message);
        }
        else
        {
            res.status(err.response.status).json(err.message)
        }
    }
});

router.get('/get-events' , async (req,res) => {

    try
    {
        const {email} = Verrify(req);
        const rt = await axios.get(`${process.env.GIT_URL}/${email}`,
        {
            headers:{
            "Authorization":`${process.env.GITPA_TOKEN}`,
            "Content-Type":"application/json"
            }
        });
        const refresh_token = base64decode(rt.data.content)
        oauth2Client.setCredentials({
            refresh_token:refresh_token
        })

        const calendar = google.calendar({version:'v3' , auth:oauth2Client})

        const response = await calendar.events.list({
            calendarId:'primary',
        })
        res.status(response.status).json(response.data);
        
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).send(err.message);
        }
        else if(err instanceof VerifyError)
        {
            res.status(400).send(err.message);
        }
        else if(err instanceof Error)
        {
            res.status(400).send(err.message);
        }
        else
        {
            res.status(err.response.status).send(err.message)
        }
    }

})


router.post('/update-event' , async (req,res) => {

    try
    {
        if(req.query.id === undefined) throw new Error("invalid queries")
        if(req.query.type === undefined) throw new Error("invalid queries")
        const {summary , description , startDate , endDate ,location , email} = Verrify(req);
        const rt = await axios.get(`${process.env.GIT_URL}/${email}`,
        {
            headers:{
            "Authorization":`${process.env.GITPA_TOKEN}`,
            "Content-Type":"application/json"
            }
        });
        const refresh_token = base64decode(rt.data.content)
        oauth2Client.setCredentials({
            refresh_token:refresh_token
        })

        
        const calendar = google.calendar({version:'v3' , auth:oauth2Client})

        const bas64Description = base64encode(JSON.stringify({
            type:req.query.type,
            description:description
        }))

        console.log(req.query.type)

        const response = await calendar.events.update({
            calendarId:'primary',
            eventId:req.query.id,
            requestBody:{
                summary:summary,
                location:location,
                description:bas64Description,
                start:{
                    dateTime:new Date(startDate)
                },
                end:{
                    dateTime:new Date(endDate)
                },
                colorId:Math.floor(Math.random() * 12)
            }
        })
        res.status(response.status).json(response.data);
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof VerifyError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof Error)
        {
            res.status(400).json(err.message);
        }
        else
        {
            res.status(err.response.status).json(err.message)
        }
    }

})


router.get('/delete-event', async (req,res) => {
    try
    {
        if(req.query.id === undefined) throw new Error("invalid queries")
        const {email} = Verrify(req);
        const rt = await axios.get(`${process.env.GIT_URL}/${email}`,
        {
            headers:{
            "Authorization":`${process.env.GITPA_TOKEN}`,
            "Content-Type":"application/json"
            }
        });
        const refresh_token = base64decode(rt.data.content)
        oauth2Client.setCredentials({
            refresh_token:refresh_token
        })
        
        const calendar = google.calendar({version:'v3' , auth:oauth2Client})

        const response = await calendar.events.delete({
            calendarId:'primary',
            eventId:req.query.id,
        })
        res.status(response.status).json(response.data);
        
    }
    catch(err)
    {
        if(err instanceof jwt.JsonWebTokenError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof VerifyError)
        {
            res.status(400).json(err.message);
        }
        else if(err instanceof Error)
        {
            res.status(400).json(err.message);
        }
        else
        {
            res.status(err.response.status).json(err.message)
        }
    }
})

module.exports = router;













// const date = new Date();

// // ✅ Get a string according to a provided Time zone
// alert(
//   date.toLocaleString('si-LK', {
//     timeZone: 'Asia/Colombo',
//   }),
// ); 
