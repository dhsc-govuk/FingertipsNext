import { render, screen } from '@testing-library/react';
import { Home } from '@/components/pages/home/index';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';


const initialState: SearchFormState = {
  indicator: '',
  message: null,
  errors: {},
};

it('snapshot test - renders the homepage', () => {
  const container = render(<Home searchFormState={initialState} />)
  
  expect(container.asFragment()).toMatchSnapshot();
});

it('should render an indicator link',() => {
  render(<Home searchFormState={initialState} />)
  const link = screen.getByRole('link', { name: /indicators/})
  
  expect(link).toBeInTheDocument();
});

it('should render an indicator link that points to the indicator section', () => {
  render(<Home searchFormState={initialState} />)
  const link = screen.getByRole('link', { name: /indicators/})

  expect(link).toHaveAttribute('href', '#indicators');
});

it('should render the SearchForm component', () => {
  render(<Home searchFormState={initialState} />)
  const searchForm = screen.getByTestId("search-form");
  
  expect(searchForm).toBeInTheDocument();
});




