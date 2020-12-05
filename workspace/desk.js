const {DragDropContext, Draggable, Droppable } = ReactBeautifulDnd

class Desk extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            week: 0,
            id: 1,
            update: false
        }

        this.decrementWeek = this.decrementWeek.bind(this)
        this.incrementWeek = this.incrementWeek.bind(this)

    }

    decrementWeek(){
        let curWeek = this.state.week
        this.setState({
            week: curWeek-1
        })
    }

    incrementWeek(){
        let curWeek = this.state.week
        this.setState({
            week: curWeek+1
        })
    }

    onDragEnd = result => {
        const { source, destination } = result
        if (!destination) {
            return
        }
        else {
            document.querySelector("#loader").style.display = "";
            let self = this
            $.ajax({
                url: "workspace/dragTask.php",
                method: "post",
                data: {
                    timestamp: destination.droppableId,
                    destination: destination.index,
                    target: source.index,
                    id: result.draggableId
                },
                success: function() {
                    document.querySelector("#loader").style.display = "none";
                    let update = !self.state.update
                    self.setState({
                        update: update
                    })
                },
                async: false
            })
        }
    };

    render(){
        let weekStyle = {
            margin: 10,
            width: "68%",
            boxSizing: "border-box",
            height: screen.availHeight*0.8 - 60,
            textAlign: "center"
        }
        let leftArrowStyle = {
            position: "flex",
            float: "left",
            width: 20,
            display: "inline-block",
            paddingTop: 0.5*(screen.availHeight*0.8 - 60),
            cursor: "pointer"
        }
        let rightArrowStyle = {
            position: "flex",
            float: "right",
            width: 20,
            display: "inline-block",
            paddingTop: 0.5*(screen.availHeight*0.8 - 60),
            cursor: "pointer"
        }
        let now = new Date()
        let days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
        let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        let day = now.getDay() == 0 ? 6 : now.getDay()-1
        let desk = []
        if (this.state.week == 0){
            for (let i = 0; i < 7; i++){
                let today = new Date()
                if (i < day){
                    today.setHours(-24*(day-i))
                    desk.push(<Day key={i} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
                else if(i == day){
                    desk.push(<Day key={i} desk_id={this.state.id} currentDay={true} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
                else{
                    today.setHours(24*(i-day))
                    desk.push(<Day key={i} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
            }
        }
        else{
            for (let i = 0; i < 7; i++){
                let today = new Date()
                today.setHours(-24*(day-i) + 24*7*this.state.week)
                desk.push(<Day key={i} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
            }
        }
        return(
            <div style={weekStyle}>
                <div style={leftArrowStyle} onClick={this.decrementWeek}>◀</div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                {desk}
                </DragDropContext>
                <div style={rightArrowStyle} onClick={this.incrementWeek}>▶</div>
            </div>
        )
    }
}

class Day extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            update: false
        }

        this.addTask = this.addTask.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
        this.completeTask = this.completeTask.bind(this)
    }

    addTask(){
        let form = document.querySelector("#"+this.props.dayOfWeek)
        if (form != null){
            let name = form.task.value
            let importance = form.importance.value
            let category = form.category.value
            if (name != "" && importance != "" && category != ""){
                let self = this
                document.querySelector("#loader").style.display = "";
                $.ajax({
                    url: "workspace/addTasks.php",
                    method: "post",
                    data: {
                        timestamp: this.props.timestamp,
                        task: name,
                        importance: importance,
                        category: category,
                        desk_id: this.props.desk_id
                    },
                    success: function() {
                        document.querySelector("#loader").style.display = "none";
                        let update = !self.state.update
                        self.setState({
                            update: update
                        })
                    },
                    async: false
                })
            }
        }
    }

    deleteTask(id){
        let self = this
        document.querySelector("#loader").style.display = "";
        $.ajax({
            url: "workspace/deleteTask.php",
            method: "post",
            data: {
                id: id
            },
            success: function() {
                document.querySelector("#loader").style.display = "none";
                let update = !self.state.update
                self.setState({
                    update: update
                })
            },
            async: false
        })
    }

    completeTask(id){
        let self = this
        document.querySelector("#loader").style.display = "";
        $.ajax({
            url: "workspace/completeTask.php",
            method: "post",
            data: {
                id: id
            },
            success: function() {
                document.querySelector("#loader").style.display = "none";
                let update = !self.state.update
                self.setState({
                    update: update
                })
            },
            async: false
        })
    }

    render(){
        let topStyle = {
            borderBottom: "1px solid black"
        }
        let currentDayTopStyle = {
            borderBottom: "1px solid black",
            color: "red"
        }
        let dayStyle = {
            display: "inline-block",
            width: "13.5%",
            backgroundColor: "white",
            position: "relative",
            border: "1px solid black",
            boxSizing: "border-box",
            marginLeft: 3,
            marginTop: 5,
            verticalAlign: "top",
        }
        let addTaskStyle = {
            backgroundColor: "gray",
            padding: "5px 0px 5px 0px"
        }
        let taskStyle = {
            border: "none",
            width: "78.5%",
            height: 30,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10
        }
        let addButtonStyle = {
            borderTopRightRadius: "50%",
            borderBottomRightRadius: "50%",
            border: "none",
            width: 30,
            height: 32,
            cursor: "pointer"
        }
        let tasksPrint = []
        let self = this
        $.ajax({
            url: "workspace/getTasks.php",
            method: "post",
            data: {
                timestamp: this.props.timestamp,
                desk_id: this.props.desk_id
            },
            success: function( result ) {
                result = JSON.parse(result)
                for (let value in result){
                    tasksPrint.push(<Task key={result[value].id} 
                        task={result[value].task}
                        importance={result[value].importance}
                        category={result[value].category}
                        deleteTask={self.deleteTask}
                        completeTask={self.completeTask}
                        isComplete={result[value].isComplete}
                        dayOrder={result[value].dayOrder}
                    />)
                }
            },
            async: false
        })
        
        let importance = ["Срочно", "Не срочно"]
        let category = ["Дом", "Учеба", "Работа"]

        let importancePrint = []
        let categoryPrint = []
        for (let i = 0; i < importance.length; i++){
            importancePrint.push(<option key={i} value={"\""+importance[i]+"\""}>{importance[i]}</option>)
        }
        for (let i = 0; i < category.length; i++){
            categoryPrint.push(<option key={i} value={"\""+category[i]+"\""}>{category[i]}</option>)
        }

        return(
            <div style={dayStyle}>
                <div style={this.props.currentDay?currentDayTopStyle:topStyle}>{this.props.dayOfWeek}<br />{this.props.date}</div>
                <div>
                    <div style={addTaskStyle}>
                        <form id={this.props.dayOfWeek}>
                            <input style={taskStyle} type="text" placeholder="Задача" name="task" />
                            <input style={addButtonStyle} type="button" value="+" onClick={this.addTask}/>
                            <Importance /><Category />
                        </form>
                    </div>
                    <Droppable droppableId={""+this.props.timestamp}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef}>
                                {tasksPrint}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>         
            </div>
        )
    }
}

class Task extends React.Component{
    render(){
        let importanceStyle
        if (this.props.importance == "Срочно"){
            importanceStyle = {
                backgroundColor: "red",
                position: "relative",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                marginTop: 20,
                wordBreak: "break-all"
            }
        }
        else if(this.props.importance == "Не срочно"){
            importanceStyle = {
                backgroundColor: "green",
                position: "relative",
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
                marginTop: 20,
                wordBreak: "break-all"
            }
        }
        let closeButtonStyle = {
            cursor: "pointer",
            position: "absolute",
            top: 0,
            right: 0,
            display: "inline:block",
            padding: 10

        }
        let isCompleteStyle = {
            padding: "0 2px"
        }
        let completer = <input type="button" onClick={()=>this.props.completeTask(this._reactInternalFiber.key)} value="Завершить &#10004;"/>
        if (this.props.isComplete == true){
            isCompleteStyle = {
                textDecoration: "line-through",
                padding: "0 2px"
            }
            completer = null
        }
        return(
            <Draggable draggableId={this._reactInternalFiber.key}
            key={this._reactInternalFiber.key}
            index={this.props.dayOrder - 0}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div style={importanceStyle}>
                        <div style={closeButtonStyle} onClick={()=>this.props.deleteTask(this._reactInternalFiber.key)}>&#10006;</div>
                        <div>
                            {this._reactInternalFiber.key}
                            <p>{this.props.category}</p>
                            <span style={isCompleteStyle}>{this.props.task}</span>
                            <br />
                            {completer}
                        </div>
                    </div>
                </div>
            )}
            </Draggable>
        )
    }
}

class Importance extends React.Component{
    render(){
        return(
            <select name="importance">
                <option value="Не срочно">Не срочно</option>
                <option value="Срочно">Срочно</option>
            </select>
        )
    }
}

class Category extends React.Component{
    render(){
        return(
            <select name="category">
                <option value="Дом">Дом</option>
                <option value="Учеба">Учеба</option>
                <option value="Работа">Работа</option>
            </select>
        )
    }
}