import { currentProfile } from "@/lib/current-profile";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
const MESSAGE_BATCH = 10;
export async function GET(
    req: Request,

) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId")


        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!channelId) {
            return new NextResponse("Channel IS is missing", { status: 400 })
        }
        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }
        let nextCursor = null;
        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (e) {
        console.log("[MEMBER_ID_PATCH]", e);
        return new NextResponse("Internal error ", { status: 500 })
    }
}