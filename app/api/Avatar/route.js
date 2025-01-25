import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const prisma = new PrismaClient();

//Create a Avtar
export async function POST(req,res) {
 
    console.log('Avatar');
    try{
        const body = await req.json();
        
        const {name,image,spiritImage}=body;

        const findAvatar= await prisma.avatar.findFirst({
            where:{
                name,
            }
        });

        if(findAvatar)
        {
            return NextResponse.json({ msg: 'Avatar already exists' , avatar:findAvatar})  ;
        }

       const newAvatar= await prisma.avatar.create({
            data: {
                name,
                image,
                spiritImage,
            },
        });

      
        return NextResponse.json({msg: 'Avatar created successfully', avatar:newAvatar});

    }
    catch(e)
    {
        console.log(e);
        return NextResponse.json({ error: 'Internal server error' });
    }
}


//get all avatars

export async function GET(req,res) {
    
        try{
            const avatars= await prisma.avatar.findMany();
            return NextResponse.json({avatars:avatars});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

//Get a single Avatar

export async function PATCH(req,res) {
    
        try{
            const body= await req.json();
            const {id}=body;
            const avatar= await prisma.avatar.findUnique({
                where:{
                    id:Number(id),
                }
            });
            return NextResponse.json({avatar});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

//delete a Avatar
 
export async function DELETE(req,res) {
    
        try{
            const body= await req.json();
            const {id}=body;
            const avatar= await prisma.avatar.delete({
                where:{
                    id:Number(id),
                }
            });
            return NextResponse.json({msg:'Avatar deleted successfully'});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }

//update a Avatar

export async function PUT(req,res) {
    
        try{
            const body = await req.json();
            const {id,name,image,spiritImage}=body;
            const avatar= await prisma.avatar.update({
                where:{
                    id:Number(id),
                },
                data:{
                    name,
                    image,
                    spiritImage
                }
            });
            return NextResponse.json({msg:'Avatar updated successfully',avatar});
        }
        catch(e)
        {
            console.log(e);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }