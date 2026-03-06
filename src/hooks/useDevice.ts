import { useMediaQuery, useTheme } from '@mui/material';
import { BREAKPOINTS } from 'pvs-design-system';

const useDevice = () => {
  const theme = useTheme();
  const { tablet, mobileLarge, laptop, smallDesktop, laptopLarge } =
    BREAKPOINTS;

  return {
    isMobile: useMediaQuery(theme.breakpoints.down(tablet)),
    isLessThanMobileLarge: useMediaQuery(theme.breakpoints.down(mobileLarge)),
    isLessThanMobileXLarge: useMediaQuery(theme.breakpoints.down(576)),
    isLaptop: useMediaQuery(`(min-width:${laptop + 1}px)`),
    isSmallDesktop: useMediaQuery(
      `(min-width:${smallDesktop}px) and (max-width:${laptop}px)`
    ),
    isDesktop: useMediaQuery(theme.breakpoints.down(1280)),
    isLessThanSmallDesktop: useMediaQuery(theme.breakpoints.down(smallDesktop)),
    isLessThanLaptop: useMediaQuery(theme.breakpoints.down(laptop)),
    isBetweenSmallDesktopAndLaptopLarge: useMediaQuery(
      theme.breakpoints.between(smallDesktop, laptopLarge)
    ),
    isBetweenTabletAndSmallDesktop: useMediaQuery(
      theme.breakpoints.between(tablet, smallDesktop)
    ),
  };
};

export default useDevice;
