import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    const handleSubscriptionSucceeded = (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    };

    const handleMemberAdded = (member: Record<string, any>) => {
      add(member.id);
    };

    const handleMemberRemoved = (member: Record<string, any>) => {
      remove(member.id);
    };

    channel.bind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
    channel.bind("pusher:member_added", handleMemberAdded);
    channel.bind("pusher:member_removed", handleMemberRemoved);

    return () => {
      if (channel) {
        channel.unbind("pusher:subscription_succeeded", handleSubscriptionSucceeded);
        channel.unbind("pusher:member_added", handleMemberAdded);
        channel.unbind("pusher:member_removed", handleMemberRemoved);
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
