import { db } from "@/lib/db";

function createResponse(message: string, status: number ) {
  return new Response(JSON.stringify({ message, status }));
}

export async function PUT(request: Request) {
  const { onboardingID }: { onboardingID: string} = await request.json();

  if (!onboardingID) {
    return createResponse("onboardingID is required", 400);
  }

  try {
    const updatingAddDevice = await db.onboardingDemo.update({
      where: {
        id: onboardingID
      },
      data: {
        docsCompleted: true,
      }
    })

    if (!updatingAddDevice) {
      return createResponse("Failed to update onboarding", 503);
    } else {
      return createResponse("Onboarding updated", 200);
    }
  } catch (error) {
    console.error(error);
    return createResponse("An unexpected error has occurred", 500);
  }
}