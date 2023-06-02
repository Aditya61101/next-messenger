import { useMemo } from "react";
import { useParams } from "next/navigation";

const useConversation = () => {
    const params = useParams();
    const conversationId = useMemo(() => {
        if (params?.conversationId) {
            return params.conversationId as string;
        }
        return "";
    }, [params?.conversationId]);
    
    //!! is a way to convert a value to boolean
    const isOpen = useMemo(() => !!conversationId, [conversationId]);
    
    return useMemo(() => ({ conversationId, isOpen }), [conversationId, isOpen]);
}
export default useConversation;