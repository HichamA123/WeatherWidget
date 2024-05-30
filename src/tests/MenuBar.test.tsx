// import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MenuBar from '../components/MenuBar/MenuBar';

//TODO finish testing menubar
describe('MenuBar component', () => {
  it('renders without crashing', () => {
    render(<MenuBar />);
  });

  it('calls validateLocation when the Search component is used', async () => {
    const { getByLabelText, getByRole } = render(<MenuBar />);
    const searchInput = getByLabelText('Search');
    const searchButton = getByRole('button', { name: 'Search' });

    fireEvent.change(searchInput, { target: { value: 'New York' } });
    fireEvent.click(searchButton);

    // Add your assertions here
  });


});