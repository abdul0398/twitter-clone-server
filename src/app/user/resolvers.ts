import axios from "axios";
import prisma from "../../client/db";
import JWTService from "../../services/jwt";

interface GoogleTokenResult {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const googleToken = token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    // setting the query parameter in above url
    googleOauthURL.searchParams.set("id_token", googleToken);

    const { data } = await axios.get<GoogleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json",
      }
    );
    console.log(data);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if(!user){
        const newuser = await prisma.user.create({
            data:{
                email:data.email,
                firstName:data.given_name,
                lastName:data.family_name,
                profileImageURL:data.picture
            }
        })
      const token = JWTService.generateTokenForUser(newuser);
      return token;
    }else{
      const token = JWTService.generateTokenForUser(user);
      return token;
    }
  },
};

export const resolvers = { queries };
