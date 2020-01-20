const { Engine, Runner,Render, Bodies, World,Body,Events} = Matter;
//destructuing the required objects
// Body object has required methods to work on velocity ,rotation dimension change etc

const cellsHorizontal = 30;
const cellsVertical = 25;

const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertical;

const engine = Engine.create();
engine.world.gravity.y=0;
//diabaling gravity in the y direction
const { world }= engine;
const render = Render.create({
    element : document.body,
    engine : engine,
    options :{
        wireframes: false,
        width,      // width =width
        height         // height = height
    }
})

Render.run(render);
Runner.run(Runner.create(),engine);



//walls

const walls =[
    // 4 parameters ( center of x axis , center of Y axis , width, height)
    Bodies.rectangle(width/2,0,width,2,{isStatic : true}),
    Bodies.rectangle(width/2,height,width,2,{isStatic : true}),
    Bodies.rectangle(0,height/2,2,height,{isStatic : true}),
    Bodies.rectangle(width,height/2,2,height,{isStatic : true})
    // siStatic is used to hold the object static in the world if not the object falls off.
]

World.add(world,walls);

//grid array is to keep track of the cells visited . 
//initially it satrts will all false value as nothig is visited .
// it is 3 x 3 matrix

// first create space for 3 items in array
// fill eachwith null
// map function runs the function on each item and return array of 3 items with false value

// grid 3x 4 structure 
// [
 
// [ , , , ],
// [ , , , ],
// [ , ,  ,]


// ]
const grid = Array(cellsVertical).fill(null).map(()=>Array(cellsHorizontal).fill(false));

// horizonatals and verticals wall track keepers
// h- 2x3   v- 3x2
const  horizontals = Array(cellsVertical-1).fill(null).map(()=> Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical).fill(null).map(()=>Array(cellsHorizontal-1).fill(false));


// Maze genration algorithm
//1. create a grid of cells
//2.pick a random starting cell
//3.for that cell, build a randomly orderd list of neighbours
//4. if the neighbour has been visited before ,remove it from the list
//5. for each remaining neighbour 'move' to it and remove the wall between the two cells
//6.repeat for this new neighbor.
// 6. backtrack if there is no valid neighbour

//generate a random row
const startRow = Math.floor(Math.random()*cellsVertical);
//generate a random column
const startColumn = Math.floor(Math.random()*cellsHorizontal);



const stepThroughCell= (row,column)=> {

    // if i have visited the cell @ [row,column] return
    if(grid[row][column])
    return;

    // mark this cell as being visited
grid[row][column]= true;

//(create randomly orderd list of neighbours // shuffle)
const shuffle = (arr)=>{
    let counter = arr.length;
    while(counter>0)
    {
        let index = Math.floor(Math.random()*counter);
        counter--;
        const temp = arr[counter];
        arr[counter]= arr[index];
        arr[index]=temp;
    }
    return arr;
}
    // assemble randomly ordered list of neighbours
const neighbours =shuffle([
    [row-1,column,"top"],
    [row+1,column,"bottom"],
    [row,column-1,"left"],
    [row,column+1,"right"]
]);





    // for each neighbour .....

    for(let neighbour of neighbours)
    {
        // extracting one cell
        const [ nextRow,nextColumn,direction] = neighbour;

       
         // see if that neighbour is out of bounds
        if(nextRow<0 || nextRow>= cellsVertical|| nextColumn <0 || nextColumn>=cellsHorizontal)
        continue;

    // if we have visited that neighbour continue to the next neighbour
  
    if(grid[nextRow][nextColumn])
    continue;


    
    // remove the wall from either horizonatl or vertical depending on the direction of movement
    if(direction === "left")
    verticals[row][column-1]=true;
    
    else  if(direction === "right")
    verticals[row][column]=true;
    
    else if(direction === "top")
    horizontals[row-1][column]=true;
    
    else if(direction === "bottom")
    horizontals[row][column]=true;
    
    stepThroughCell(nextRow,nextColumn);
    
}





    // visit that next cell


}

// create a random cell
stepThroughCell(startRow,startColumn);

// true means no wall is present
// flase means wall is present 


//drawing the hozrizoantl segment in the rectagle
//forEach will automatically give indexNumber 
horizontals.forEach((row,rowIndex)=>{
 row.forEach((open,columnIndex)=>
 {
     if(open)
     return;
     const wall = Bodies.rectangle(
         columnIndex * unitLengthX + (unitLengthX/2),
         rowIndex * unitLengthY + unitLengthY,
         unitLengthX,10,// (x,y,width,height) for the rectangle // we need to get to the center of row 
         {
            label : "wall",
             isStatic : true,
             render :{
                fillStyle : "red"
            }
         }
     );
     World.add(world,wall);
 })
})


//drawing the vertical segment in the rectagle
//forEach will automatically give indexNumber 
verticals.forEach((row,rowIndex)=>{
    row.forEach((open,columnIndex)=>
    {
        if(open)
        return;
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY/2,
            10,unitLengthY,// (x,y,width,height) for the rectangle // we need to get to the center of colum
            {
                label : "wall",
                isStatic : true,
                render :{
                    fillStyle : "red"
                }
            }
        );
        World.add(world,wall);
    })
   })

   // drwaing the goal box in the last cell
const goal = Bodies.rectangle(
    width- unitLengthX/2,
    height - unitLengthY/2,
    unitLengthX*0.6,
    unitLengthY*0.6,
    {
        isStatic : true,
        label : "goal",
        render :{
            fillStyle : "green"
        }
    }

)
World.add(world,goal);

// ball(x,y, radius)
// go to the center of x y point (first cell)
const ballRadius = Math.min(unitLengthX,unitLengthY)/4
const ball =Bodies.circle(
unitLengthX/2,
unitLengthY/2,
ballRadius,
// optons object
{
    label : "ball",
    render :{
        fillStyle : "blue"
    }
}
)
World.add(world,ball);


const {x,y} = ball.velocity;


document.addEventListener("keydown",(event)=>
{
    //onsole.log(event);
    if(event.keyCode=== 87 ) // up = w  87 
    Body.setVelocity(ball, {x, y: y-5});

    if(event.keyCode=== 83 ) //   down= s 83
    Body.setVelocity(ball, {x, y: y+5});


    if(event.keyCode=== 65)// left = a  65
    Body.setVelocity(ball, {x :x-5, y});


    if(event.keyCode=== 68) //right = d  68 
    Body.setVelocity(ball, {x: x+5, y});
})


// whenever some event occurs matterJS adds some properties toevent object and call back function gets exceuted
//only one event object is present in JS
//immddiately all properties are wiped out
// label  is a in built propety in the event object
// pair is an inbuilt property

//Event is an object extracted from matterJS
// pairs is one of the  property present in the object
//'collision' is an iterator in the event object 
//entire JS has only one event object 
Events.on(engine,"collisionStart", (event)=>{
      event.pairs.forEach(collision=>
        {

        const labels = ['ball','goal'];
       
      if(labels.includes(collision.bodyA.label)  && labels.includes(collision.bodyB.label))
    
    {
        document.querySelector(".winner").classList.remove("hidden");
          world.gravity.y = 1;
     // acelerate all the objects towards the ground

     // iterate over each shape and remove the static flag 
     world.bodies.forEach(body=>
        {
            if(body.label==="wall")
            Body.setStatic(body,false);
        })
    }
      })
      }
)

