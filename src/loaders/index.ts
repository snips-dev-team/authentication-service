import expressLoader from "./express";
import dbLoader from "./db";
import emailLoader from "./email";

function loader(app: any): void {
  dbLoader();
  emailLoader();
  expressLoader(app);
}

export default loader;
