import EchoReply from "./EchoReply/EchoReply"
import '../Echos/Echos.css'
import ReplyCompose from "../ReplyCompose/ReplyCompose"
import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeEchoReply } from "../../../store/echos"

const EchoReplies = ({echo, setShowReplies, setSelectedEcho}) => {
    const containerRef = useRef(null)
    const dispatch = useDispatch()
    const replies = useSelector(state => {
        const currentEcho = state.echos.all.filter(stateEcho => stateEcho._id === echo._id)[0]
        if (currentEcho) {
            return currentEcho.replies
        }
    })


    const deleteReply = (replyId) => {
        dispatch(removeEchoReply(echo._id, replyId))
    }

    const scrollToBottom = () => {
        setTimeout(() => {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }, 200);
    }

    return (
        <div className="reply-list" >
            <div className="replies-container" ref={containerRef} >
                {replies.map(reply => (
                    <EchoReply key={reply._id} reply={reply} deleteReply={deleteReply} echoId={echo._id} />
                ))}
            </div>
            <div className="hide-replies">
                <i className="fa-solid fa-arrow-left" onClick={() => {
                    setShowReplies(false)
                    setSelectedEcho(null)
                    }}></i>
            </div>
            <ReplyCompose echoId={echo._id} scrollToBottom={scrollToBottom} />
        </div>
    )
}
export default EchoReplies

