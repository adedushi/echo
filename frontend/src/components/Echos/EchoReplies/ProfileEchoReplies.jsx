import EchoReply from "./EchoReply/EchoReply"
import '../Echos/Echos.css'
import ReplyCompose from "../ReplyCompose/ReplyCompose"
import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeEchoReply } from "../../../store/echos"
import { fetchProfileUser } from "../../../store/users"
import { useParams } from "react-router-dom"

const ProfileEchoReplies = ({echo, setShowReplies, feedType}) => {
    const containerRef = useRef(null)
    const dispatch = useDispatch()
    const { userId } = useParams(); 
    let replies = []
    let user = useSelector(state => state.users.profileUser)

    if (feedType === 'profileFeed') {
        const currentEcho = user.profileFeed.filter(stateEcho => stateEcho._id === echo._id)[0]
        if (currentEcho) {
                replies = currentEcho.replies
            }
    } else if (feedType === 'likes') {
        const currentEcho = user.likes.filter(stateEcho => stateEcho._id === echo._id)[0]
        if (currentEcho) {
                replies = currentEcho.replies
            }
    } else if (feedType === 'reverbs') {
        const currentEcho = user.reverbs.filter(stateEcho => stateEcho._id === echo._id)[0]
        if (currentEcho) {
                replies = currentEcho.replies
            }
    }



    const deleteReply = (replyId) => {
        dispatch(removeEchoReply(echo._id, replyId))
        setTimeout(() => dispatch(fetchProfileUser(userId)), 300)
        
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
                <i className="fa-solid fa-arrow-left" onClick={() => setShowReplies(false)}></i>
            </div>
            <ReplyCompose echoId={echo._id} scrollToBottom={scrollToBottom} profileReply={true} />
        </div>
    )
}
export default ProfileEchoReplies