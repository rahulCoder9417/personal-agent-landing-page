// The waitlist is closed: the product is live and sign-up is at app.textcrew.in.
// This route used to take sign-ups and email a confirmation link; it now sends nothing
// and stores nothing. Confirm links in emails already sent still work (see /waitlist/confirm).

const GONE = {
  error: "The waitlist is closed. Textcrew is live: sign up at https://app.textcrew.in/sign-up",
  signUp: "https://app.textcrew.in/sign-up",
};

export function POST() {
  return Response.json(GONE, { status: 410 });
}
