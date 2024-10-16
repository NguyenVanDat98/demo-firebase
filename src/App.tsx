import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import { Avatar, Button } from "antd";
import Firebase from "./firebase"
import { User } from "firebase/auth";

const Jsondata = [
  {
    title: "Troy Rodriquez",
    decs: "hand bit powerful summer simplest children anything broken advice pan separate meant sent cut group track enjoy loose eight tune bright construction completely stems",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Nancy Hart",
    decs: "tide center birds her inside relationship this news sharp piece save fully found symbol corn next rest progress source lamp into huge whom clothing",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Grace Hughes",
    decs: "course fairly chapter attention greatest weather was bread smile wash excitement went tip bit blue adventure ran sort stood instance establish column ocean changing",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Jack Frazier",
    decs: "flew remember serve piece direct wing longer try stomach degree total ear fence happen my cloth entirely to plate breathe pack inch shoe label",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Ophelia Salazar",
    decs: "acres equally pick upper battle lie by skin hour slabs factory swung colony operation standard graph square research shown feet spider against tomorrow sheep",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Cecelia Atkins",
    decs: "cold compare small prize program vote book water express general teach control ago face chemical thing happen remarkable entire ride society seems dress team",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Max Coleman",
    decs: "party kitchen dirt flow began principle structure brain white doll coast pale magnet free came fill good bare slipped flew accept ranch pound team",
    img:'home/1727627310547-728193455-2024-09-29.mov',
  },
  {
    title: "Ophelia Salazar",
    decs: "acres equally pick upper battle lie by skin hour slabs factory swung colony operation standard graph square research shown feet spider against tomorrow sheep",
  },
];

function App() {
  const [height, setHight] = useState(30);
  const [indexActive, setIndexActive] = useState(0);
  const refNav = useRef<HTMLDivElement>(null);
  const refMain = useRef<HTMLDivElement>(null);
  const ref = useRef(0);
  const trust = useRef(0);
 const [userLogin,setUser]= useState<User | null>(null)
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  const [data,setData]= useState<any>([])

  useLayoutEffect(() => {
    if (refNav.current?.offsetHeight) {
      setHight(refNav.current?.offsetHeight / Jsondata.length);
      ref.current = refNav.current?.offsetHeight / Jsondata.length;
    }
  }, []);
  useEffect(()=>{
    
    const arr:unknown[] = []
    refMain.current?.childNodes?.forEach((el)=>{

      const element = el as Element
      const envet = new IntersectionObserver(function(entries){
            const [entrie]=entries
            if(entrie.isIntersecting){
              const idx:string = entrie.target.className.split('index')[1]
              setIndexActive(Number(idx) * ref.current);
            }
           
          },{
            root : refMain.current,
            threshold:0.6
          })
          envet.observe(element);
          arr.push([envet.unobserve,element])
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timeInterVal :any;
    // let trust = 0
    function runtime(){
      return ()=>{
        timeInterVal = setInterval(()=>{
          trust.current+=1;
          if(trust.current>=Jsondata.length){
            trust.current = 0
          }
          setIndexActive(trust.current*ref.current)
          const node =refMain.current?.childNodes[trust.current] as Element
          node?.scrollIntoView({
            behavior:'smooth',
            block:'start'
           })
        },5000)
      }
    }
    runtime()()
     

    return ()=>{
      if(timeInterVal)
      clearInterval(timeInterVal)
    }
  },[])
  // console.log(data)

  useEffect(()=>{
    const fn = Firebase.onAuthStateChanged(function a (user){
      setUser(user)
    })
    // Firebase.setDocUser({
    //   fullName: 'Marcus Price',
    //   username:'marcus_price',
    //   email:'marcus_price@gmail.com',
    //   address:'12 havel'
    // })

     Firebase.fetchData().then((users)=>{
      // setData(users)
      console.log(users)
     }).catch((error)=>{
      console.log(error)
     })
   
    
    return ()=>{
      fn()
    }
  },[])

async function handleLogin (){
  try {
    await Firebase.signIn()

  } catch (error) {
    console.log('error :>> ', error);
  }
}

  return (
    <>
      <h1>Hello</h1>
      <div>
        <h3>
          {!userLogin && (
            <Button type="primary" onClick={handleLogin}>
              Login with Google
            </Button>
          )}
          {userLogin && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap:20
              }}
            >
              <Avatar style={{width:100,height:100}} src={userLogin?.photoURL} />
              <span>{userLogin?.displayName}</span>
              <Button
                danger
                type="dashed"
                onClick={Firebase.signOut(() => setUser(null))}
              >
                Logout Google
              </Button>
            </div>
          )}
        </h3>
      </div>

      <div
        className="wiget-container"
        style={{
          width: "clamp(400px, 80vw, 800px)",
          height: "clamp(370px, 100vh, 500px)",
        }}
      >
        <div className="nav-bar" ref={refNav}>
          {Jsondata.map(({ title }, idx) => (
            <div
              className="nav-item"
              onClick={() => {
                setIndexActive(idx * ref.current);
                trust.current = idx;
                const el = refMain.current?.getElementsByClassName(
                  "index" + idx
                );
                el?.[0]?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {title}
            </div>
          ))}
        </div>
        <div className="scroll-bar">
          <div className="track" style={{ height, top: indexActive }}></div>
        </div>
        <div className="main" ref={refMain}>
          {Jsondata.map(({ decs }, index) => (
            <div
              className={["content-item", "index" + index].join(" ")}
              style={{ height: refNav.current?.offsetHeight }}
            >
              <h3>{index}</h3>
              {/* <video 
                height={'60%'} 
                width={'100%'} 
                style={{objectFit:'contain'}}
                autoPlay={true}
                playsInline
                preload="auto"
                controls
                src="http://localhost:8099/api/image?pathFile=home/1727628172308-372460382-2024-09-29.mov"
                >
              </video> */}
              {/* <img height={'60%'} width={'100%'} style={{objectFit:'contain'}} src="http://14.225.217.10:8099/api/image?pathFile=home/1727627310547-728193455-2024-09-29.mov"/> */}
              {decs}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


export default App;
