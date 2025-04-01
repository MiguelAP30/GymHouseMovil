declare module 'react-native-onboarding-swiper' {
  import { ViewStyle, TextStyle } from 'react-native';
  import { ReactNode } from 'react';

  interface OnboardingPage {
    backgroundColor: string;
    image: ReactNode;
    title: string;
    subtitle: string;
  }

  interface OnboardingProps {
    pages: OnboardingPage[];
    onDone: () => void;
    onSkip?: () => void;
    showSkip?: boolean;
    showNext?: boolean;
    showDone?: boolean;
    containerStyles?: ViewStyle;
    titleStyles?: TextStyle;
    subTitleStyles?: TextStyle;
  }

  const Onboarding: React.FC<OnboardingProps>;
  export default Onboarding;
} 