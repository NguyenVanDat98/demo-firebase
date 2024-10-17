/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp  } from "firebase/app";
import { Firestore,getFirestore } from 'firebase/firestore';
import { Auth, getAuth, GoogleAuthProvider, NextOrObserver, onAuthStateChanged, signInWithCustomToken, signInWithPopup, User, UserCredential,signOut  } from 'firebase/auth';
import { collection,doc, setDoc,getDocs, } from "firebase/firestore"; 
import {v4} from "uuid";

type UserSchema = {
    fullName: string;
    username: string;
    password?: string;
    email?: string;
    address?: string;
}


const debName = {
    user:"Users",
    order:"Orders",
    config:"Config",
} satisfies Record<string,string>;

class FirebaseStatic {
    static config: FirebaseOptions = {
        apiKey: "AIzaSyC0bnWQppWIWMShNGtqNcvtC9AMpW35Yr0",
        authDomain: "todo-app-4c16b.firebaseapp.com",
        projectId: "todo-app-4c16b",
        storageBucket: "todo-app-4c16b.appspot.com",
        messagingSenderId: "625088009840",
        appId: "1:625088009840:web:f6265758790526d98ac6b5",
        measurementId: "G-6K8ZFBCHND",
      }
    static instance: Firebase

    static getInstance(){
        if(!FirebaseStatic.instance){
            FirebaseStatic.instance = new Firebase();
        }
        return FirebaseStatic.instance
    }
}


class Firebase extends FirebaseStatic {
    #app:FirebaseApp
    #auth:Auth;
    dbClient: Firestore;
    #provider: GoogleAuthProvider;
    async signIn () : Promise<UserCredential>{
        return await signInWithPopup(this.#auth,this.#provider)
    } 
    async signInWithToken (token:string) : Promise<UserCredential>{
        return await signInWithCustomToken(this.#auth,token)
    } 
    signOut(callback:()=>void){
        return ()=>signOut(this.#auth).then(callback)
    }
    onAuthStateChanged (callback:NextOrObserver<User>) {
       return onAuthStateChanged(this.#auth,callback)
    }
    getColl (nameCollection:string){ return collection(this.dbClient, nameCollection)};
    async fetchData() {
        const citiesRef = this.getColl(debName.user);
        return  (await getDocs(citiesRef)).docs.map((doc)=>({ id: doc.id, ...doc.data()}))
    }
    async setDocUser (body:UserSchema){
       return await setDoc( doc(this.getColl(debName.user), v4() ), body);
    }
    constructor(){
        super();
        this.#app = initializeApp(FirebaseStatic.config)
        this.dbClient = getFirestore(this.#app);
        this.#auth = getAuth(this.#app);
        this.#provider = new GoogleAuthProvider();

    }

}

export default FirebaseStatic.getInstance();