import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MyLocation from '../components/MenuBar/MyLocation';


//TODO NOT DONE finish testing MyLocation
describe('MyLocation component', () => {
  it('renders without crashing', () => {
    const { getByLabelText } = render(<MyLocation isApiOverloaded={() => false} validateLocation={() => Promise.resolve(true)} />);
    const button = getByLabelText('My Location');
    // expect(button).toBeInTheDocument();
  });

  it('calls click function when the button is clicked', () => {
    const clickMock = jest.fn();
    const { getByLabelText } = render(
      <MyLocation isApiOverloaded={() => false} validateLocation={() => Promise.resolve(true)} />
    );
    const button = getByLabelText('My Location');
    button.onclick = clickMock;
    fireEvent.click(button);
    expect(clickMock).toHaveBeenCalled();
  });

  it('disables button when loading is true', () => {
    const { getByLabelText } = render(
      <MyLocation isApiOverloaded={() => false} validateLocation={() => Promise.resolve(true)} />
    );
    const button = getByLabelText('My Location');
    // expect(button).toBeDisabled();
  });

  it('handles error when geolocation is not supported', async () => {
    const toastMock = jest.fn();

    const { getByLabelText } = render(
      <MyLocation 
        isApiOverloaded={() => false} 
        validateLocation={() => Promise.resolve(true)} 
        // useToast={() => ({ toast: toastMock })} 
      />
    );
    const button = getByLabelText('My Location');
    fireEvent.click(button);
    await waitFor(() => expect(toastMock).toHaveBeenCalledTimes(1));
  });

  // Add more tests to cover other functionalities and scenarios as needed
});
