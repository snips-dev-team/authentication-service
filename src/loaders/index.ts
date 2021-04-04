import expressLoader from "./express";
import dbLoader from "./db";

function loader(app: any): void {
  dbLoader();
  expressLoader(app);
}

export default loader;
