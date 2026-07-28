import React, { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import MessageItem, { MessageProps } from './MessageItem';

interface MessageContainerProps {
  messages: MessageProps[];
  onDelete?: (id: string | number) => void;
  onReply?: (id: string | number) => void;
  onCopy?: (text: string) => void;
  onPressButton?: (button: any) => void;
}

export default function MessageContainer({ messages, onDelete, onReply, onCopy, onPressButton }: MessageContainerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 p-1"
      contentContainerStyle={{ paddingBottom: 16 }}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      <View className="flex-1 justify-end">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            msg={msg}
            onDelete={onDelete}
            onReply={onReply}
            onCopy={onCopy}
            onPressButton={onPressButton}
          />
        ))}
      </View>
    </ScrollView>
  );
}
