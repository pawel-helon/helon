export default async function WeeksAvailabilityPage(props: { params: { week: string } }) {
  return (
    <div>
      Meetings page - {props.params.week}
    </div>
  )
}