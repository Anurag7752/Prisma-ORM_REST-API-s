import prisma from "../DB/db_config.js";

// Get User

export const fetchUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        select:{
            _count: {
                select:{
                    post: {
                        comment: true,
                    },
                },
            },
        },
    });

    return res.json({status: 200, data: users});
};

export const createUser = async (req, res) => {
    const {name, email, password} = req.body;
    const findUser = await prisma.user.findUnique({
        where :{
            email : email
        }
    })

    if(findUser){
        return res.json({status:400, message:"Email Already Taken . prisma another email."})
    }
    const newUser = await prisma.user.create({
        data:{
            name: name,
            email:email,
            password:password
        }
    })
    return res.json({status:200, data:newUser, msg:"user created"})
};

// Show user

export const showUser = async (req, res) => {
    const userId = req.params.id
    const user = await prisma.user.findFirst({
        where:{
            id:Number(userId)
        }
    })

    return res.json({status: 200, data: user});
};

// update the user

export const updateUser = async (req, res) => {
    const userId = req.params.id
    const {name, email, password} = req.body;

    await prisma.user.update({
        where:{
            id:Number(userId)
        },
        data:{
            name,
            email,
            password
        }

    })
    return res.json({status: 200,  msg: "Your updated successfully."});
};


// Delete User

export const deleteUser = async(req, res) => {
    const userId = req.params.id;
    await prisma.user.delete({
        where:{
        id:Number(userId),
        }, 
    });

    return res.json({status: 200, msg: "User deleted successfully"});

};







