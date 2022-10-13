export interface ResponseFuncs {
    GET?: Function
    POST?: Function
    PUT?: Function
    DELETE?: Function
  }
  
  export interface SignIn {
    _id?: Number;
    username: String;
    password: String;
  }

export interface Credentials {
  username: String;
  password: String;
  redirect: Boolean;
}