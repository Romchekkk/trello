const {DragDropContext, Draggable, Droppable } = ReactBeautifulDnd

class Desk extends React.Component{
    constructor(props){
        super(props)

        let today = new Date()
        let date = today.getFullYear() + "-" +
        (((Math.round(today.getMonth())+1)+"").length==1?('0'+(Math.round(today.getMonth())+1)):(Math.round(today.getMonth())+1)) + "-" +
        (((today.getDate()+"").length==1)?('0'+today.getDate()):(today.getDate()))

        this.state = {
            week: 0,
            id: 1,
            update: false,
            displayTaskAdder: "none",
            dateForTask: date
        }

        this.decrementWeek = this.decrementWeek.bind(this)
        this.incrementWeek = this.incrementWeek.bind(this)
        this.showTaskAdder = this.showTaskAdder.bind(this)
        this.hideTaskAdder = this.hideTaskAdder.bind(this)

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

    showTaskAdder(date){
        let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
        let regexp = new RegExp(/[^\d]+/, 'ui')
        date = date.replace(regexp, '-'+months.indexOf(date.match(regexp)[0].trim())+'-').split(/-/)
        date[1] = Math.round(date[1])+1
        if (date[1].length == 1){
            date[1] = '0'+date[1]
        }
        if (date[0].length == 1){
            date[0] = '0'+date[0]
        }
        date = date[2]+"-"+date[1]+"-"+date[0]
        this.setState({
            displayTaskAdder: "block",
            dateForTask: date
        })
    }

    hideTaskAdder(date){
        this.setState({
            displayTaskAdder: "none",
            dateForTask: date
        })
    }

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
                    desk.push(<Day key={i} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
                else if(i == day){
                    desk.push(<Day key={i} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={true} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
                else{
                    today.setHours(24*(i-day))
                    desk.push(<Day key={i} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
                }
            }
        }
        else{
            for (let i = 0; i < 7; i++){
                let today = new Date()
                today.setHours(-24*(day-i) + 24*7*this.state.week)
                desk.push(<Day key={i} showTaskAdder={this.showTaskAdder} desk_id={this.state.id} currentDay={false} dayOfWeek={days[i]} timestamp={today.getTime()} date={today.getDate()+" "+months[today.getMonth()] + " " + today.getFullYear()} />)
            }
        }
        return(
            <div style={weekStyle}>
                <div style={leftArrowStyle} onClick={this.decrementWeek}>◀</div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                {desk}
                </DragDropContext>
                <div style={rightArrowStyle} onClick={this.incrementWeek}>▶</div>
                <TaskAdder desk_id={this.state.id} displayTaskAdder={this.state.displayTaskAdder} dateForTask={this.state.dateForTask} hideTaskAdder={this.hideTaskAdder}/>
            </div>
        )
    }
}

class TaskAdder extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            isPeriod: false,
            dateForTaskFirst: this.props.dateForTask,
            dateForTaskSecond: this.props.dateForTask
        }

        this.setPeriod = this.setPeriod.bind(this)
        this.unsetPeriod = this.unsetPeriod.bind(this)
        this.setDateForTaskFirst = this.setDateForTaskFirst.bind(this)
        this.setDateForTaskSecond = this.setDateForTaskSecond.bind(this)
        this.addTask = this.addTask.bind(this)
    }

    setPeriod(){
        this.setState({
            isPeriod: true
        })
    }

    unsetPeriod(){
        this.setState({
            isPeriod: false
        })
    }

    
    shouldComponentUpdate(newProps){
        if (this.state.dateForTaskFirst != newProps.dateForTask){
            this.setState({
                dateForTaskFirst: newProps.dateForTask,
                dateForTaskSecond: newProps.dateForTask
            })
        }
        return true;
    }

    setDateForTaskFirst(){
        this.setState({
            dateForTaskFirst: document.querySelector("#taskAdderForm").taskDateFirst.value
        })
    }

    setDateForTaskSecond(){
        this.setState({
            dateForTaskSecond: document.querySelector("#taskAdderForm").taskDateSecond.value
        })
    }

    addTask(){
        let form = document.querySelector("#taskAdderForm")
        if (form != null){
            let task = form.task.value
            let importance = form.importance.value
            let category = form.category.value
            let timestampFirst = new Date(this.state.dateForTaskFirst)
            timestampFirst = timestampFirst.getTime()
            let timestampSecond = new Date(this.state.dateForTaskSecond)
            timestampSecond = timestampSecond.getTime()
            if (task != "" && importance != "" && category != ""){
                let self = this
                document.querySelector("#loader").style.display = "";
                $.ajax({
                    url: "workspace/addTasks.php",
                    method: "post",
                    data: {
                        timestampFirst: timestampFirst,
                        timestampSecond: timestampSecond,
                        task: task,
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

    render(){
        let styleTaskAdder = {
            width: "100vw",
            height: "100vh",
            position: "absolute", 
            top: 0, 
            left: 0,
            textAlign: "center",
            color: "black",
            zIndex: 10,
            display: this.props.displayTaskAdder,
            backgroundColor: "rgba(78, 78, 78, 0.5)"
        }
        let styleFormTaskAdder = {
            width: 350,
            padding: 30,
            position: "relative", 
            top: "50%", 
            left: "50%", 
            margin: "-130px 0 0 -175px",
            backgroundColor: "gray",
            border: "1px solid black",
            borderRadius: 10,
            borderSpacing: 0,
        }
        let styleInputTaskAdder = {
            width: "90%",
            height: 30,
            margin: "5px 0 5px 0",
            borderRadius: 10,
            textAlign: "center"
        }
        let styleCloseButton = {
            width: 20,
            height: 20,
            border: "1px solid black",
            backgroundColor: "rgba(78,78,78)",
            cursor: "pointer",
            position: "absolute",
            right: 10,
            top: 10,
            padding: 1
        }
        let date = []
        if (this.state.isPeriod == false){
            date.push(<input key="1" name="dateType" type="radio" checked="checked" onChange={this.unsetPeriod} />)
            date.push(<span key="2">Конкретный день</span>)
            date.push(<input key="3" name="dateType" type="radio" checked="" onChange={this.setPeriod}/>)
            date.push(<span key="4">Период</span>)
            date.push(<br key="5" />)
            date.push(<input key="6" type="date" name="taskDateFirst" value={this.state.dateForTaskFirst} onChange={this.setDateForTaskFirst}/>)
        }
        else {
            date.push(<input key="1" name="dateType" type="radio" checked="" onChange={this.unsetPeriod} />)
            date.push(<span key="2">Конкретный день</span>)
            date.push(<input key="3" name="dateType" type="radio" checked="checked" onChange={this.setPeriod}/>)
            date.push(<span key="4">Период</span>)
            date.push(<br key="5" />)
            date.push(<span key="6">Дата начала:</span>)
            date.push(<input key="7" type="date" name="taskDateFirst" value={this.state.dateForTaskFirst} onChange={this.setDateForTaskFirst}/>)
            date.push(<br key="8" />)
            date.push(<span key="9">Дата окончания:</span>)
            date.push(<input key="10" type="date" name="taskDateSecond" value={this.state.dateForTaskSecond} onChange={this.setDateForTaskSecond}/>)
        }

        let importance = ["Срочно", "Средней важности", "Не срочно"]
        let category = ["Дом", "Учеба", "Работа"]

        let importancePrint = []
        let categoryPrint = []
        for (let i = 0; i < importance.length; i++){
            importancePrint.push(<option key={i} value={importance[i]}>{importance[i]}</option>)
        }
        for (let i = 0; i < category.length; i++){
            categoryPrint.push(<option key={i} value={category[i]}>{category[i]}</option>)
        }
        return(
        <div style={styleTaskAdder}>
            <form style={styleFormTaskAdder} id="taskAdderForm">
                <div style={styleCloseButton} onClick={this.props.hideTaskAdder}>✖</div>
                <input style={styleInputTaskAdder} type="text" name="task" placeholder="Задача" /><br /><br />
                <span>Дата</span>
                <br />
                {date}<br /><br />
                <span>Прочие параметры</span><br />
                Категория: <select name="category">{categoryPrint}</select><br />
                Важность: <select name="importance">{importancePrint}</select><br />
                <input type="button" style={styleInputTaskAdder} onClick={this.addTask} value="Добавить задание" />
            </form>
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

        this.deleteTask = this.deleteTask.bind(this)
        this.completeTask = this.completeTask.bind(this)
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
        let addButtonStyle = {
            borderRadius: 10,
            border: "none",
            width: "90%",
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
                console.dir(result)
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
        
        
        return(
            <div style={dayStyle}>
                <div style={this.props.currentDay?currentDayTopStyle:topStyle}>{this.props.dayOfWeek}<br />{this.props.date}</div>
                <div>
                    <div style={addTaskStyle}>
                        <form id={this.props.dayOfWeek}>
                            <input style={addButtonStyle} type="button" value="Добавить задание" onClick={()=>this.props.showTaskAdder(this.props.date)}/>
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
        else if(this.props.importance == "Средней важности"){
            importanceStyle = {
                backgroundColor: "yellow",
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
            right: 0,
            width: 20,
            height: 20,
            display: "inline:block",
            padding: 1,
            border: "1px solid black",
            margin: "5px 5px 0 0",
            backgroundColor: "goldenrod"
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
                        <div style={closeButtonStyle} onClick={()=>this.props.deleteTask(this._reactInternalFiber.key)}>✖</div>
                        <div>
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